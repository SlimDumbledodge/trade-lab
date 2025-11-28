import { Injectable } from "@nestjs/common"
import { PortfolioAsset, Prisma } from "prisma/generated/client"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class PortfoliosAssetsService {
    constructor(private readonly prisma: PrismaService) {}

    async createPortfolioAsset(
        portfolioId: number,
        assetId: number,
        quantity: Prisma.Decimal,
        buyPrice: Prisma.Decimal,
    ): Promise<PortfolioAsset> {
        // On calcule le nouveau prix moyen avant de passer à Prisma
        const newAverageBuyPrice = await this.calculateNewAverageBuyPrice(portfolioId, assetId, quantity, buyPrice)
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

    async calculateNewAverageBuyPrice(portfolioId: number, assetId: number, quantity: Prisma.Decimal, buyPrice: Prisma.Decimal) {
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
}
