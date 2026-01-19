"use client"

import { HomeLayout } from "@/components/layouts/HomeLayout"
import { PortfolioPerformanceChart, PortfolioPoint } from "@/components/charts/PortfolioPerformanceChart"
import { Button } from "@/components/ui/button"
import { useCallback, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { usePortfolio } from "@/hooks/usePortfolio"
import { PORTFOLIO_PERFORMANCE_PERIODS } from "@/lib/constants"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"
import { PriceChange } from "@/components/ui/price-change"
import { PortfolioAssetCard } from "@/components/portfolio/PortfolioAssetsCard"

function Portfolio() {
    const [selectedPeriod, setSelectedPeriod] = useState<PORTFOLIO_PERFORMANCE_PERIOD>(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY)
    const [performanceData, setPerformanceData] = useState<{ pnlEuros: number; pnlPercent: number; holdingsValue: number }>({
        pnlEuros: 0,
        pnlPercent: 0,
        holdingsValue: 0,
    })

    const { data: session } = useSession()
    const {
        data: portfolio,
        isLoading: isPortfolioLoading,
        error: portfolioError,
    } = usePortfolio(selectedPeriod, session?.accessToken)

    const lastHoveredPnlRef = useRef<number | null>(null)
    const handleHover = useCallback((currentPnl: number, currentHoldingsValue: number) => {
        // On évite la division par zéro
        const investedAmount = currentHoldingsValue - currentPnl
        const pnlPercent = investedAmount !== 0 ? (currentPnl / investedAmount) * 100 : 0

        if (lastHoveredPnlRef.current !== currentPnl) {
            lastHoveredPnlRef.current = currentPnl
            setPerformanceData({
                pnlEuros: currentPnl,
                pnlPercent,
                holdingsValue: currentHoldingsValue,
            })
        }
    }, [])

    if (isPortfolioLoading) return <p>Chargement...</p>
    if (portfolioError) return <p className="text-red-600">{portfolioError?.message}</p>
    if (!portfolio) return <p>Aucun portefeuille trouvé</p>

    const firstUnrealizedPnl = portfolio.points[0]?.unrealizedPnl ?? 0
    const formatPerformancePoints: PortfolioPoint[] = portfolio.points.map((point) => {
        return {
            holdingsValue: point.holdingsValue,
            unrealizedPnl: point.unrealizedPnl - firstUnrealizedPnl,
            recordedAt: point.recordedAt,
        }
    })

    const lastSnapshot = formatPerformancePoints[formatPerformancePoints.length - 1]

    return (
        <HomeLayout headerTitle="Portefeuille">
            <div className="flex flex-col gap-6">
                {/* En-tête avec valeur du portefeuille */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Portefeuille</h1>
                    <p className="text-4xl font-bold">
                        {Number(performanceData.holdingsValue ?? lastSnapshot.holdingsValue).toFixed(2)} €
                    </p>
                    <div className="flex gap-2">
                        <PriceChange value={performanceData.pnlEuros} />
                        <span
                            className={`font-semibold text-s ${performanceData.pnlPercent > 0 ? "text-green-500" : performanceData.pnlPercent < 0 ? "text-red-500" : "text-muted-foreground"}`}
                        >
                            ({performanceData.pnlPercent > 0 ? "+" : ""}
                            {performanceData.pnlPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {PORTFOLIO_PERFORMANCE_PERIODS.map((period) => (
                        <Button
                            variant={selectedPeriod === period.value ? "link" : "ghost"}
                            key={period.value}
                            onClick={() => setSelectedPeriod(period.value)}
                            className="text-xs rounded font-bold"
                        >
                            {period.label}
                        </Button>
                    ))}
                </div>

                {/* Graphique et card investissements */}
                <div className="flex gap-6">
                    <div className="flex-1">
                        <PortfolioPerformanceChart points={formatPerformancePoints} handleHover={handleHover} />
                    </div>
                    <div>
                        <PortfolioAssetCard />
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default Portfolio
