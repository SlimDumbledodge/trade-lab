"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/usePortfolio"
import { usePortfolioAssets } from "@/hooks/usePortfolioAssets"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"
import { useSession } from "next-auth/react"

export function PerformanceCard() {
    const { data: session } = useSession()
    const { data: portfolio, error: errorPortfolio } = usePortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, session?.accessToken)

    if (errorPortfolio) return <p>Erreur: {errorPortfolio.message}</p>

    const isPositive = Number(portfolio?.totalPnl) > 0
    const trendWord = isPositive ? "en hausse" : "en baisse"
    const pnlColor = isPositive ? "text-green-500" : "text-red-500"

    return (
        <Card className="w-full min-[1200px]:max-w-xs">
            <CardHeader>
                <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Votre portefeuille est {trendWord} de{" "}
                    <span className={`font-semibold ${pnlColor}`}>{Number(portfolio?.totalPnlPercent).toFixed(2)}%</span> depuis
                    le début avec {isPositive ? "un profit" : "une perte"} de{" "}
                    <span className={`font-semibold ${pnlColor}`}>{Number(portfolio?.totalPnl).toFixed(2)}€</span>.
                </p>
            </CardContent>
        </Card>
    )
}
