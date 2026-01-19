import { Prisma } from "prisma/generated/client"

export enum PORTFOLIO_PERFORMANCE_PERIOD {
    ONE_DAY = "1d",
    ONE_WEEK = "1s",
    ONE_MONTH = "1m",
    SIX_MONTHS = "6m",
    ONE_YEAR = "1y",
}

export type PortfolioPerformance = {
    recordedAt: Date
    holdingsValue: Prisma.Decimal
    unrealizedPnl: Prisma.Decimal
}
