"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { usePortfolio } from "@/hooks/usePortfolio"
import { usePortfolioAssets } from "@/hooks/usePortfolioAssets"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"
import { TrendingUp, TrendingDown, Wallet, PiggyBank, BarChart3, Trophy, AlertTriangle } from "lucide-react"
import { useMemo } from "react"

export function StatsKpiCards() {
    const { data: session } = useSession()
    const { data: portfolio } = usePortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, session?.accessToken)
    const { data: portfolioAssets } = usePortfolioAssets(session?.accessToken)

    const { bestAsset, worstAsset } = useMemo(() => {
        if (!portfolioAssets || portfolioAssets.length === 0) return { bestAsset: null, worstAsset: null }
        const sorted = [...portfolioAssets].sort((a, b) => Number(b.unrealizedPnl) - Number(a.unrealizedPnl))
        return {
            bestAsset: sorted[0],
            worstAsset: sorted[sorted.length - 1],
        }
    }, [portfolioAssets])

    const totalPnl = Number(portfolio?.totalPnl ?? 0)
    const totalPnlPercent = Number(portfolio?.totalPnlPercent ?? 0)
    const isPositive = totalPnl >= 0

    const kpis = [
        {
            label: "Valeur totale",
            value: `${Number(portfolio?.totalValue ?? 0).toFixed(2)} €`,
            icon: Wallet,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Cash disponible",
            value: `${Number(portfolio?.cashBalance ?? 0).toFixed(2)} €`,
            icon: PiggyBank,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
        },
        {
            label: "PnL total",
            value: `${isPositive ? "+" : ""}${totalPnl.toFixed(2)} €`,
            subtitle: `${isPositive ? "+" : ""}${totalPnlPercent.toFixed(2)}%`,
            icon: isPositive ? TrendingUp : TrendingDown,
            color: isPositive ? "text-green-500" : "text-red-500",
            bg: isPositive ? "bg-green-500/10" : "bg-red-500/10",
            subtitleColor: isPositive ? "text-green-500" : "text-red-500",
        },
        {
            label: "Positions",
            value: `${portfolioAssets?.length ?? 0}`,
            subtitle: "actif(s) en portefeuille",
            icon: BarChart3,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            subtitleColor: "text-muted-foreground",
        },
        {
            label: "Meilleur actif",
            value: bestAsset?.asset.symbol ?? "—",
            subtitle: bestAsset
                ? `${Number(bestAsset.unrealizedPnl) >= 0 ? "+" : ""}${Number(bestAsset.unrealizedPnl).toFixed(2)} €`
                : undefined,
            icon: Trophy,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            subtitleColor: Number(bestAsset?.unrealizedPnl ?? 0) >= 0 ? "text-green-500" : "text-red-500",
        },
        {
            label: "Pire actif",
            value: worstAsset?.asset.symbol ?? "—",
            subtitle: worstAsset
                ? `${Number(worstAsset.unrealizedPnl) >= 0 ? "+" : ""}${Number(worstAsset.unrealizedPnl).toFixed(2)} €`
                : undefined,
            icon: AlertTriangle,
            color: "text-red-400",
            bg: "bg-red-400/10",
            subtitleColor: Number(worstAsset?.unrealizedPnl ?? 0) >= 0 ? "text-green-500" : "text-red-500",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((kpi) => (
                <Card key={kpi.label} className="relative overflow-hidden">
                    <CardContent className="px-3">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <p className="text-[13px] text-muted-foreground leading-none">{kpi.label}</p>
                                <div className={`rounded-md p-1.5 ${kpi.bg}`}>
                                    <kpi.icon className={`size-3.5 ${kpi.color}`} />
                                </div>
                            </div>
                            <p className="text-base font-bold leading-tight">{kpi.value}</p>
                            {kpi.subtitle && <p className={`text-[11px] leading-none ${kpi.subtitleColor}`}>{kpi.subtitle}</p>}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
