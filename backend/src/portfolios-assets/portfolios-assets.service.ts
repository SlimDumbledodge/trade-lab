import { BadRequestException, Injectable, Logger } from "@nestjs/common"
import { PortfolioAsset, Prisma } from "prisma/generated/client"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class PortfoliosAssetsService {
    private readonly logger = new Logger(PortfoliosAssetsService.name)
    constructor(private readonly prisma: PrismaService) {}

    async getPortfolioAsset(symbol: string, portfolioId: number) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: {
                id: portfolioId,
            },
        })

        if (!portfolio) {
            this.logger.error(`❌ Erreur getPortfolioAsset: Portfolio introuvable avec l'ID ${portfolioId}`)
            throw new BadRequestException(`❌ Erreur getPortfolioAsset: Portfolio introuvable avec l'ID ${portfolioId}`)
        }

        const asset = await this.prisma.asset.findUnique({
            where: {
                symbol,
            },
        })

        if (!asset) {
            this.logger.error(`❌ Erreur getPortfolioAsset: asset introuvable avec le symbol ${symbol}`)
            throw new BadRequestException(`❌ Erreur getPortfolioAsset: asset introuvable avec l'ID ${symbol}`)
        }

        return this.prisma.portfolioAsset.findUnique({
            where: {
                portfolioId_assetId: {
                    assetId: asset.id,
                    portfolioId,
                },
            },
        })
    }

    async createPortfolioAsset(
        portfolioId: number,
        assetId: number,
        quantity: Prisma.Decimal,
        buyPrice: Prisma.Decimal,
    ): Promise<PortfolioAsset> {
        // On calcule le nouveau prix moyen avant de passer à Prisma
        const newAverageBuyPrice = await this.getNewAverageBuyPrice(portfolioId, assetId, quantity, buyPrice)
        return this.prisma.portfolioAsset.upsert({
            where: { portfolioId_assetId: { portfolioId, assetId } },
            create: {
                portfolioId,
                assetId,
                quantity,
                averageBuyPrice: buyPrice,
            },
            update: {
                quantity: { increment: quantity },
                averageBuyPrice: newAverageBuyPrice,
                updatedAt: new Date(),
            },
        })
    }

    async getNewAverageBuyPrice(portfolioId: number, assetId: number, quantity: Prisma.Decimal, buyPrice: Prisma.Decimal) {
        const existingPortfolioAsset = await this.prisma.portfolioAsset.findUnique({
            where: { portfolioId_assetId: { portfolioId, assetId } },
        })
        if (!existingPortfolioAsset) return buyPrice

        const oldQuantity = existingPortfolioAsset.quantity
        const oldAverageBuyPrice = existingPortfolioAsset.averageBuyPrice

        const newQuantity = oldQuantity.add(quantity)
        const totalValue = oldQuantity.mul(oldAverageBuyPrice).add(quantity.mul(buyPrice))
        const newAverageBuyPrice = totalValue.div(newQuantity)

        return newAverageBuyPrice
    }

    async getTotalUnrealizedPnL(portfolioId: number) {
        const holdings = await this.prisma.portfolioAsset.findMany({
            where: { portfolioId },
            include: { asset: true },
        })

        return holdings.reduce((acc, holding) => {
            const pnl = holding.asset.lastPrice.sub(holding.averageBuyPrice).mul(holding.quantity)
            return acc.add(pnl)
        }, new Prisma.Decimal(0))
    }

    async getUnrealizedPnLPerAsset(portfolioId: number) {
        const holdings = await this.prisma.portfolioAsset.findMany({
            where: { portfolioId },
            include: { asset: true },
        })

        if (!holdings) throw new BadRequestException(`getUnrealizedPnLPerAsset : Aucun ordre trouver pour l'ID du portoflio ${portfolioId}`)

        return holdings.map((holding) => {
            return {
                ...holding,
                holdingValue: holding.asset.lastPrice.mul(holding.quantity),
                unrealizedPnL: holding.asset.lastPrice.sub(holding.averageBuyPrice).mul(holding.quantity),
            }
        })
    }
}
