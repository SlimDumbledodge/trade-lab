import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { Prisma, TransactionType } from "prisma/generated/client"
import { PortfoliosAssetsService } from "src/portfolios-assets/portfolios-assets.service"
import { PortfoliosSnapshotsService } from "src/portfolios-snapshots/portfolios-snapshots.service"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "src/portfolios-snapshots/types/types"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class PortfoliosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly portfoliosAssetsService: PortfoliosAssetsService,
        private readonly portfoliosSnapshotsService: PortfoliosSnapshotsService,
    ) {}

    async getPortfolio(portfolioId: number, period: PORTFOLIO_PERFORMANCE_PERIOD) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
        })
        if (!portfolio) throw new NotFoundException(`Portfolio ID ${portfolioId} not found`)

        const points = await this.portfoliosSnapshotsService.getPortfolioPerformance(portfolioId, period)
        return {
            ...portfolio,
            points,
        }
    }

    create(userId: number) {
        return this.prisma.portfolio.create({
            data: { user: { connect: { id: userId } } },
            include: { user: true },
        })
    }

    async checkSufficientFunds(portfolioId: number, amount: Prisma.Decimal) {
        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } })
        if (!portfolio) throw new NotFoundException("Portfolio introuvable")
        if (portfolio.cashBalance.lessThan(amount)) throw new BadRequestException("Fonds insuffisants")
    }

    async updatePortfolioCashBalance(portfolioId: number, amount: Prisma.Decimal, transactionType: TransactionType) {
        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } })
        if (!portfolio) throw new NotFoundException("Portfolio introuvable")

        const newCashBalance =
            transactionType === TransactionType.buy ? portfolio.cashBalance.sub(amount) : portfolio.cashBalance.add(amount)

        await this.prisma.portfolio.update({ where: { id: portfolioId }, data: { cashBalance: newCashBalance } })
    }

    async calculatePortfolioAssetsValue(portfolioId: number) {
        const portfolioAssets = await this.prisma.portfolioAsset.findMany({
            where: { portfolioId: portfolioId },
            include: { asset: true },
        })

        if (!portfolioAssets || !portfolioAssets.length) {
            await this.prisma.portfolio.update({
                where: { id: portfolioId },
                data: { holdingsValue: new Prisma.Decimal(0) },
            })
            return
        }

        const holdingsValue = portfolioAssets.reduce((acc, portfolioAsset) => {
            return acc.add(portfolioAsset.quantity.mul(portfolioAsset.asset.lastPrice))
        }, new Prisma.Decimal(0))

        await this.prisma.portfolio.update({ where: { id: portfolioId }, data: { holdingsValue } })

        // Recalculer les weights de tous les assets avec le nouveau holdingsValue
        if (holdingsValue.greaterThan(0)) {
            await Promise.all(
                portfolioAssets.map((portfolioAsset) => {
                    const assetHoldingValue = portfolioAsset.quantity.mul(portfolioAsset.asset.lastPrice)
                    const weight = assetHoldingValue.div(holdingsValue).mul(100)
                    return this.prisma.portfolioAsset.update({
                        where: { id: portfolioAsset.id },
                        data: { weight },
                    })
                }),
            )
        }
    }
}
