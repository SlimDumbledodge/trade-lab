import { BadRequestException, Injectable } from "@nestjs/common"
import { Prisma } from "prisma/generated/client"
import { PortfoliosAssetsService } from "src/portfolios-assets/portfolios-assets.service"
import { PrismaService } from "src/prisma/prisma.service"
import { PORTFOLIO_PERFORMANCE_PERIOD, PortfolioPerformance } from "./types/types"
import * as moment from "moment"

@Injectable()
export class PortfoliosSnapshotsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly portfoliosAssetsService: PortfoliosAssetsService,
    ) {}

    async capturePortfolioSnapshot(portfolioId: number) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: {
                portfolioAssets: {
                    include: {
                        asset: true,
                    },
                },
            },
        })
        if (!portfolio) throw new BadRequestException(`capturePortfolioSnapshot: Portfolio introuvable pour l'ID ${portfolioId}`)

        let holdingsValue = new Prisma.Decimal(0)
        for (const portfolioAsset of portfolio.portfolioAssets) {
            holdingsValue = holdingsValue.add(portfolioAsset.quantity.mul(portfolioAsset.asset.lastPrice))
        }
        await this.prisma.portfolioSnapshots.create({
            data: {
                portfolioId,
                cashBalance: portfolio.cashBalance,
                holdingsValue,
                recordedAt: new Date(),
            },
        })
    }

    async getPortfolioPerformance(portfolioId: number, period: PORTFOLIO_PERFORMANCE_PERIOD): Promise<PortfolioPerformance[] | []> {
        const { amount, unit, granularity } = this.getGranularity(period)

        if (!granularity) {
            return this.prisma.portfolioSnapshots.findMany({
                where: {
                    portfolioId,
                    recordedAt: { gte: moment().subtract(amount, unit).toDate() },
                },
                orderBy: { recordedAt: "asc" },
                select: { recordedAt: true, holdingsValue: true },
            })
        }

        const results = await this.prisma.$queryRaw<PortfolioPerformance[]>`
        SELECT DISTINCT ON (date_bin(interval ${Prisma.raw(`'${granularity}'`)}, "recordedAt", timestamp '1970-01-01')) 
            date_bin(interval ${Prisma.raw(`'${granularity}'`)}, "recordedAt", timestamp '1970-01-01') AS "recordedAt",
            "holdingsValue"
        FROM 
            "PortfolioSnapshots"
        WHERE 
            "portfolioId" = ${portfolioId}
        AND 
            "recordedAt" >= NOW() - interval ${Prisma.raw(`'${amount} ${unit}'`)}
        ORDER BY 
            date_bin(interval ${Prisma.raw(`'${granularity}'`)}, "recordedAt", timestamp '1970-01-01'),
            "recordedAt" DESC;`
        return results ?? []
    }

    private getGranularity(period: PORTFOLIO_PERFORMANCE_PERIOD): {
        amount: number
        unit: moment.unitOfTime.DurationConstructor
        granularity: string | null
    } {
        switch (period) {
            case "1d":
                return { amount: 1, unit: "days", granularity: null }
            case "1s":
                return { amount: 7, unit: "days", granularity: "1 hour" }
            case "1m":
                return { amount: 1, unit: "months", granularity: "4 hours" }
            case "6m":
                return { amount: 6, unit: "months", granularity: "1 day" }
            case "1y":
                return { amount: 1, unit: "years", granularity: "1 week" }
            default:
                return { amount: 100, unit: "years", granularity: "1 week" }
        }
    }
}
