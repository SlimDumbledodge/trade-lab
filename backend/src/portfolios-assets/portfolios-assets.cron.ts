import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class PortfoliosAssetsCron {
    private readonly logger = new Logger(PortfoliosAssetsCron.name)

    constructor(private readonly prisma: PrismaService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async updateHoldingsValue() {
        this.logger.log("🔄 Début de la mise à jour des holdingsValue et unrealizedPnl...")

        try {
            // Récupérer tous les portfolioAssets avec leurs assets
            const portfolioAssets = await this.prisma.portfolioAsset.findMany({
                include: {
                    asset: true,
                },
            })

            if (portfolioAssets.length === 0) {
                this.logger.warn("⚠️ Aucun PortfolioAsset trouvé")
                return
            }

            // Mettre à jour chaque holdingsValue et unrealizedPnl
            const updates = portfolioAssets.map((portfolioAsset) => {
                const newHoldingsValue = portfolioAsset.quantity.mul(portfolioAsset.asset.lastPrice)
                const investedAmount = portfolioAsset.averageBuyPrice.mul(portfolioAsset.quantity)
                const newUnrealizedPnl = newHoldingsValue.sub(investedAmount)

                return this.prisma.portfolioAsset.update({
                    where: { id: portfolioAsset.id },
                    data: {
                        holdingsValue: newHoldingsValue,
                        unrealizedPnl: newUnrealizedPnl,
                        updatedAt: new Date(),
                    },
                })
            })

            await Promise.all(updates)

            this.logger.log(`✅ ${portfolioAssets.length} holdingsValue et unrealizedPnl mis à jour avec succès`)
        } catch (error) {
            this.logger.error(`❌ Erreur lors de la mise à jour des holdingsValue: ${error.message}`)
        }
    }
}
