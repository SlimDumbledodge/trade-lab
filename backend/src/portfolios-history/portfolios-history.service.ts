import { BadRequestException, Injectable } from "@nestjs/common"
import { PortfoliosAssetsService } from "src/portfolios-assets/portfolios-assets.service"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class PortfoliosHistoryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly portfoliosAssetsService: PortfoliosAssetsService,
    ) {}

    async capturePortfolioSnapshot(portfolioId: number) {
        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } })
        if (!portfolio) throw new BadRequestException(`capturePortfolioSnapshot: Portfolio introuvable pour l'ID ${portfolioId}`)

        const unrealizedPnL = await this.portfoliosAssetsService.getTotalUnrealizedPnL(portfolioId)
        await this.prisma.portfolioHistory.create({
            data: {
                portfolioId,
                cashBalance: portfolio.cashBalance,
                unrealizedPnL,
            },
        })
    }
}
