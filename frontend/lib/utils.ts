import { TrendValue } from "@/components/portfolio/PortfolioAssetsCard"
import { PortfolioAsset } from "@/types/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getTrendValue = (asset: PortfolioAsset, trend: TrendValue): { value: number; unit: "€" | "%" } => {
    switch (trend) {
        case "daily_pct":
            return { value: Number(asset.asset.todayPerformance), unit: "%" }
        case "daily_eur": {
            const dailyPnl = Number(asset.asset.lastPrice) * (Number(asset.asset.todayPerformance) / 100) * Number(asset.quantity)
            return { value: dailyPnl, unit: "€" }
        }
        case "since_buy_pct": {
            const invested = Number(asset.averageBuyPrice) * Number(asset.quantity)
            const pct = invested !== 0 ? (Number(asset.unrealizedPnl) / invested) * 100 : 0
            return { value: pct, unit: "%" }
        }
        case "since_buy_eur":
            return { value: Number(asset.unrealizedPnl), unit: "€" }
    }
}
