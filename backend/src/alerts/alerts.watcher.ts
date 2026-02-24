import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { AlertStatus, AlertType, NotificationType } from "prisma/generated/enums"
import { MarketStatusService } from "src/market-status/market-status.service"
import { PrismaService } from "src/prisma/prisma.service"
import { PriceAlertConfig } from "./interfaces/price-alert-config.interface"
import { NotificationsService } from "src/notifications/notifications.service"
import * as Sentry from "@sentry/nestjs"

@Injectable()
export class AlertsWatcher {
    private readonly logger = new Logger(AlertsWatcher.name)
    private readonly BATCH_SIZE = 100

    constructor(
        private readonly prisma: PrismaService,
        private readonly marketStatusService: MarketStatusService,
        private readonly notificationsService: NotificationsService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async processActiveAlerts() {
        const isMarketOpen = await this.marketStatusService.isMarketOpen()

        if (!isMarketOpen) {
            this.logger.debug("Marché fermé, vérification des alertes ignorée")
            return
        }

        this.logger.debug("Lancement de la vérification des alertes")

        await this.handlePriceAlerts()
    }

    private async handlePriceAlerts() {
        try {
            const activePriceAlerts = await this.prisma.alert.findMany({
                where: {
                    type: AlertType.PRICE,
                    status: AlertStatus.ACTIVE,
                },
            })

            if (!activePriceAlerts.length) {
                this.logger.debug("handlePriceAlerts : Aucune alerte de prix active")
                return
            }

            const symbols = [...new Set(activePriceAlerts.map((alert) => (alert.config as unknown as PriceAlertConfig).symbol))]

            const assets = await this.prisma.asset.findMany({ where: { symbol: { in: symbols } } })

            const alertsToTrigger = activePriceAlerts.filter((alert) => {
                const config = alert.config as unknown as PriceAlertConfig
                const asset = assets.find((asset) => asset.symbol === config.symbol)

                if (!asset) {
                    this.logger.warn(`Asset introuvable pour le symbole "${config.symbol}" (alerte #${alert.id})`)
                    return false
                }

                const currentPrice = Number(asset.lastPrice)

                return (
                    (config.direction === "BELOW" && currentPrice <= config.targetPrice) ||
                    (config.direction === "ABOVE" && currentPrice >= config.targetPrice)
                )
            })

            if (!alertsToTrigger.length) {
                this.logger.debug(`handlePriceAlerts : ${activePriceAlerts.length} alertes vérifiées, aucune déclenchée`)
                return
            }

            this.logger.log(`handlePriceAlerts : ${alertsToTrigger.length} alerte(s) à déclencher`)

            for (let i = 0; i < alertsToTrigger.length; i += this.BATCH_SIZE) {
                const batch = alertsToTrigger.slice(i, i + this.BATCH_SIZE)

                const results = await Promise.allSettled(batch.map((alert) => this.triggerAlert(alert)))

                const successes = results.filter((r) => r.status === "fulfilled").length
                const failures = results.length - successes

                this.logger.debug(`results`, results)
                this.logger.debug(`Batch ${i / this.BATCH_SIZE + 1}: ${successes} OK, ${failures} erreurs`)
            }
        } catch (error) {
            Sentry.captureException(error)
            this.logger.error("❌ Erreur dans handlePriceAlerts", error)
        }
    }

    private async triggerAlert(alert: { id: number; userId: number; config: unknown }) {
        const config = alert.config as PriceAlertConfig

        const asset = await this.prisma.asset.findUnique({ where: { symbol: config.symbol } })
        const assetName = asset?.name ?? config.symbol

        await this.prisma.alert.update({
            where: { id: alert.id },
            data: {
                status: AlertStatus.TRIGGERED,
                triggeredAt: new Date(),
            },
        })

        await this.notificationsService.create({
            userId: alert.userId,
            alertId: alert.id,
            type: NotificationType.ALERT,
            title: "Alerte de prix déclenchée",
            message: `Le prix de ${assetName} a ${config.direction === "ABOVE" ? "dépassé" : "chuté sous"} ${config.targetPrice}€`,
            data: config,
        })

        this.logger.log(`Alerte #${alert.id} déclenchée : ${config.symbol} ${config.direction} ${config.targetPrice}€`)
    }
}
