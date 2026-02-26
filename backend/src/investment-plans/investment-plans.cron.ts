import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import * as moment from "moment-timezone"
import { MarketStatusService } from "src/market-status/market-status.service"
import { PrismaService } from "src/prisma/prisma.service"
import { TransactionsService } from "src/transactions/transactions.service"
import { AssetOperationDto } from "src/portfolios/dto/asset-operation-dto"
import { FrequencyType, FirstExecutionType, NotificationType } from "prisma/generated/enums"
import { NotificationsService } from "src/notifications/notifications.service"

@Injectable()
export class InvestmentPlansCron {
    private readonly logger = new Logger(InvestmentPlansCron.name)
    private readonly BATCH_SIZE = 100

    constructor(
        private readonly prisma: PrismaService,
        private readonly marketStatusService: MarketStatusService,
        private readonly transactionsService: TransactionsService,
        private readonly notificationsService: NotificationsService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_5PM)
    async executeInvestmentPlans() {
        if (!this.marketStatusService.isMarketOpen()) {
            this.logger.debug("Marché fermé :  report de l'exécution des plans d'investissements")
            return
        }
        this.logger.log("Début de l'exécution des plans d'investissement...")

        const today = moment().date()
        if (today === 2) {
            await this.processFirstTimePlans(FirstExecutionType.MONTH_START)
        } else if (today === 16) {
            await this.processFirstTimePlans(FirstExecutionType.MID_MONTH)
        }

        await this.processScheduledPlans()

        this.logger.log("Fin de l'exécution des plans d'investissement")
    }

    private async processFirstTimePlans(firstExecution: FirstExecutionType) {
        const plans = await this.prisma.investmentPlans.findMany({
            where: { isFirstExecution: true, firstExecution },
            include: { user: { include: { portfolio: true } } },
        })

        if (!plans.length) {
            this.logger.debug("Aucun plan à exécuter pour la première fois")
            return
        }

        await this.executePlans(plans, { isFirstExecution: false })
    }

    private async processScheduledPlans() {
        const plans = await this.prisma.investmentPlans.findMany({
            where: {
                isFirstExecution: false,
                nextExecutionAt: { lte: moment().toDate() },
            },
            include: { user: { include: { portfolio: true } } },
        })

        if (!plans.length) {
            this.logger.debug("Aucun plan récurrent à exécuter")
            return
        }

        await this.executePlans(plans)
    }

    private async executePlans(
        plans: Array<{
            id: number
            userId: number
            assetId: number
            amount: { div: (value: any) => any }
            frequency: FrequencyType
            user: { portfolio: { id: number } | null }
        }>,
        extraUpdateData: Record<string, any> = {},
    ) {
        const assetIds = [...new Set(plans.map((plan) => plan.assetId))]
        const assets = await this.prisma.asset.findMany({
            where: { id: { in: assetIds } },
        })
        const assetsMap = new Map(assets.map((asset) => [asset.id, asset]))

        for (let i = 0; i < plans.length; i += this.BATCH_SIZE) {
            const batch = plans.slice(i, i + this.BATCH_SIZE)

            const results = await Promise.allSettled(
                batch.map(async (plan) => {
                    if (!plan.user.portfolio) {
                        throw new Error(`L'utilisateur ${plan.userId} n'a pas de portfolio`)
                    }

                    const asset = assetsMap.get(plan.assetId)
                    if (!asset) {
                        throw new Error(`Asset ${plan.assetId} introuvable`)
                    }

                    const data: AssetOperationDto = {
                        assetId: plan.assetId,
                        quantity: Number(plan.amount.div(asset.lastPrice)),
                    }
                    try {
                        const nextExecutionDate = this.calculateNextExecution(plan.frequency)
                        await this.transactionsService.buyAsset(plan.user.portfolio.id, data)
                        await this.prisma.investmentPlans.update({
                            where: { id: plan.id },
                            data: { nextExecutionAt: nextExecutionDate.toDate(), ...extraUpdateData },
                        })
                        await this.notificationsService.create({
                            userId: plan.userId,
                            type: NotificationType.INVESTMENT_PLAN,
                            title: "Plan d'investissement exécuté",
                            message: `Achat automatique de ${Number(plan.amount).toFixed(2)} € de ${asset.name} effectué avec succès.`,
                            data: { assetName: asset.name, amount: Number(plan.amount), status: "success" },
                        })
                    } catch (error) {
                        const reason = error?.message?.includes("Fonds insuffisants")
                            ? "Fonds insuffisants sur votre portfolio"
                            : "Une erreur est survenue lors de l'exécution"
                        await this.notificationsService.create({
                            userId: plan.userId,
                            type: NotificationType.INVESTMENT_PLAN,
                            title: "Échec du plan d'investissement",
                            message: `L'achat automatique de ${asset.name} a échoué : ${reason}.`,
                            data: { assetName: asset.name, reason, status: "failure" },
                        })
                        throw error
                    }
                }),
            )

            const successes = results.filter((r) => r.status === "fulfilled").length
            const failures = results.length - successes

            this.logger.debug(`Batch ${i / this.BATCH_SIZE + 1}: ${successes} OK, ${failures} erreurs`)

            if (failures > 0) {
                results
                    .filter((r) => r.status === "rejected")
                    .forEach((r) => this.logger.error("Échec d'exécution de plan:", (r as PromiseRejectedResult).reason))
            }
        }
    }

    private calculateNextExecution(frequency: FrequencyType) {
        const today = moment()
        switch (frequency) {
            case FrequencyType.WEEKLY:
                return today.add(1, "week").startOf("day")
            case FrequencyType.TWICE_BY_MONTH:
                return today.add(2, "weeks").startOf("day")
            case FrequencyType.MONTHLY:
                return today.add(1, "month").startOf("day")
            case FrequencyType.QUARTERLY:
                return today.add(3, "months").startOf("day")
        }
    }
}
