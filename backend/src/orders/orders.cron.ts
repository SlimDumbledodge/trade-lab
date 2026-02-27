import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { OrderAction, OrderStatus, OrderType, NotificationType } from "prisma/generated/enums"
import { MarketStatusService } from "src/market-status/market-status.service"
import { PrismaService } from "src/prisma/prisma.service"
import { TransactionsService } from "src/transactions/transactions.service"
import { NotificationsService } from "src/notifications/notifications.service"

interface TriggeredOrder {
    id: number
    userId: number
    assetId: number
    type: OrderType
    action: OrderAction
    quantity: { toNumber: () => number }
    asset: { name: string; lastPrice: { toNumber: () => number } }
    user: { portfolio: { id: number } | null }
}

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
    [OrderType.LIMIT]: "limite",
    [OrderType.STOP]: "stop",
}

@Injectable()
export class OrdersCron {
    private readonly logger = new Logger(OrdersCron.name)
    private readonly BATCH_SIZE = 100

    constructor(
        private readonly prisma: PrismaService,
        private readonly marketStatusService: MarketStatusService,
        private readonly transactionsService: TransactionsService,
        private readonly notificationsService: NotificationsService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async processActiveOrders() {
        if (!(await this.marketStatusService.isMarketOpen())) {
            this.logger.debug("Marché fermé, vérification des ordres ignorée")
            return
        }

        this.logger.debug("Lancement de la vérification des ordres")

        await this.expireOrders()

        const activeOrders = await this.prisma.order.findMany({
            where: { status: OrderStatus.ACTIVE },
            include: { asset: true, user: { include: { portfolio: true } } },
        })

        if (!activeOrders.length) {
            this.logger.debug("Aucun ordre actif")
            return
        }

        const ordersToTrigger = activeOrders.filter((order) => this.shouldTrigger(order))

        if (!ordersToTrigger.length) {
            this.logger.debug(`${activeOrders.length} ordres vérifiés, aucun déclenché`)
            return
        }

        this.logger.log(`${ordersToTrigger.length} ordre(s) à déclencher`)
        await this.executeOrdersInBatches(ordersToTrigger)
    }

    private async expireOrders() {
        const { count } = await this.prisma.order.updateMany({
            where: { status: OrderStatus.ACTIVE, expiresAt: { lte: new Date() } },
            data: { status: OrderStatus.EXPIRED },
        })

        if (count > 0) {
            this.logger.log(`${count} ordre(s) expiré(s)`)
        }
    }

    /**
     * Détermine si un ordre doit être déclenché selon son type et son action :
     *
     * - LIMIT BUY  → acheter quand le prix descend au niveau cible  (currentPrice <= targetPrice)
     * - LIMIT SELL → vendre quand le prix monte au niveau cible     (currentPrice >= targetPrice)
     * - STOP BUY   → acheter quand le prix monte au niveau cible    (currentPrice >= targetPrice)
     * - STOP SELL  → vendre quand le prix descend au niveau cible   (currentPrice <= targetPrice)
     */
    private shouldTrigger(order: { type: OrderType; action: OrderAction; targetPrice: unknown; asset: { lastPrice: unknown } }): boolean {
        const currentPrice = Number(order.asset.lastPrice)
        const targetPrice = Number(order.targetPrice)

        switch (order.type) {
            case OrderType.LIMIT:
                return order.action === OrderAction.BUY ? currentPrice <= targetPrice : currentPrice >= targetPrice

            case OrderType.STOP:
                return order.action === OrderAction.BUY ? currentPrice >= targetPrice : currentPrice <= targetPrice
        }
    }

    private async executeOrdersInBatches(orders: TriggeredOrder[]) {
        for (let i = 0; i < orders.length; i += this.BATCH_SIZE) {
            const batch = orders.slice(i, i + this.BATCH_SIZE)

            const results = await Promise.allSettled(batch.map((order) => this.executeOrder(order)))

            const successes = results.filter((r) => r.status === "fulfilled").length
            const failures = results.length - successes

            this.logger.debug(`Batch ${i / this.BATCH_SIZE + 1}: ${successes} OK, ${failures} erreurs`)

            if (failures > 0) {
                results
                    .filter((r) => r.status === "rejected")
                    .forEach((r) => this.logger.error("Échec d'exécution d'ordre:", (r as PromiseRejectedResult).reason))
            }
        }
    }

    private async executeOrder(order: TriggeredOrder) {
        const portfolio = order.user.portfolio
        if (!portfolio) {
            throw new Error(`L'utilisateur ${order.userId} n'a pas de portfolio`)
        }

        const quantity = order.quantity.toNumber()
        const operationDto = { assetId: order.assetId, quantity }
        const typeLabel = ORDER_TYPE_LABELS[order.type]
        const actionLabel = order.action === OrderAction.BUY ? "Achat" : "Vente"

        try {
            if (order.action === OrderAction.BUY) {
                await this.transactionsService.buyAsset(portfolio.id, operationDto)
            } else {
                await this.transactionsService.sellAsset(portfolio.id, operationDto)
            }

            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.TRIGGERED, triggeredAt: new Date() },
            })

            await this.notificationsService.create({
                userId: order.userId,
                type: NotificationType.ORDER,
                title: `Ordre ${typeLabel} exécuté`,
                message: `${actionLabel} de ${quantity} ${order.asset.name} exécuté au prix de ${order.asset.lastPrice.toNumber().toFixed(2)} €.`,
                data: {
                    orderId: order.id,
                    assetName: order.asset.name,
                    type: order.type,
                    action: order.action,
                    quantity,
                    status: "success",
                },
            })

            this.logger.log(`Ordre #${order.id} (${typeLabel}) exécuté : ${actionLabel} ${quantity} ${order.asset.name}`)
        } catch (error) {
            const reason = error?.message?.includes("Fonds insuffisants")
                ? "Fonds insuffisants sur votre portfolio"
                : "Une erreur est survenue lors de l'exécution"

            await this.notificationsService.create({
                userId: order.userId,
                type: NotificationType.ORDER,
                title: `Échec de l'ordre ${typeLabel}`,
                message: `L'ordre sur ${order.asset.name} a échoué : ${reason}.`,
                data: { orderId: order.id, assetName: order.asset.name, reason, status: "failure" },
            })

            throw error
        }
    }
}
