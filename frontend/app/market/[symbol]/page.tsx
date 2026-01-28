"use client"

import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { ASSET_PRICE_PERIOD } from "@/types/types"
import { AssetPriceChart, PricePoint } from "../../../components/charts/AssetPriceChart"
import Image from "next/image"
import { useState, useRef, useCallback, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PriceChange } from "@/components/ui/price-change"
import TradeExecutionForm from "@/components/market/TradeExecutionForm"
import { useAssetPrices } from "@/hooks/useAssetPrices"
import { useAsset } from "@/hooks/useAsset"
import { ASSET_PRICE_PERIODS } from "@/lib/constants"
import { PositionDetails } from "@/components/market/PositionDetailsCard"
import { usePortfolioAsset } from "@/hooks/usePortfolioAsset"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { SkeletonChart } from "@/components/ui/skeleton-chart"
import { SkeletonMarketDetails } from "@/components/ui/skeleton-market-details"

export default function MarketProductDetails() {
    const { data: session } = useSession()
    const params = useParams()
    const symbol = params?.symbol as string
    const [selectedPeriod, setSelectedPeriod] = useState<ASSET_PRICE_PERIOD>(ASSET_PRICE_PERIOD.ONE_DAY)
    const [performanceData, setPerformanceData] = useState<{ totalValue: number; valueEur: number; valuePercent: number }>({
        totalValue: 0,
        valueEur: 0,
        valuePercent: 0,
    })
    const lastValueRef = useRef<number | null>(null)

    const handlePerformanceData = useCallback((currentPrice: number, openingPrice: number) => {
        const differenceEur = currentPrice - openingPrice
        const differencePercent = ((currentPrice - openingPrice) / openingPrice) * 100

        if (lastValueRef.current !== differenceEur) {
            lastValueRef.current = differenceEur
            setPerformanceData({ totalValue: currentPrice, valueEur: differenceEur, valuePercent: differencePercent })
        }
    }, [])

    const { data: asset, isLoading: assetLoading, error: assetError } = useAsset(symbol, session?.accessToken)
    const { data: portfolioAsset, isLoading: isPortfolioAssetLoading } = usePortfolioAsset(symbol, session?.accessToken)

    const {
        data: assetPrices,
        isLoading: assetPricesLoading,
        error: assetPricesError,
    } = useAssetPrices(symbol, selectedPeriod, session?.accessToken ?? undefined)

    if (assetLoading || assetPricesLoading || isPortfolioAssetLoading)
        return (
            <HomeLayout headerTitle={"Marché"}>
                <SkeletonMarketDetails />
            </HomeLayout>
        )
    if (assetError || assetPricesError) return <p className="text-red-600">{assetError?.message || assetPricesError?.message}</p>
    if (!asset || !assetPrices) return <p>Introuvable</p>

    const formatAssetPrices: PricePoint[] = assetPrices.map((price) => {
        return {
            recordedAt: price.recordedAt,
            closingPrice: price.closingPrice,
        }
    })
    const lastClosingPrice = formatAssetPrices[formatAssetPrices.length - 1]

    return (
        <HomeLayout headerTitle={"Marché"}>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Partie gauche: En-tête, boutons de période et graphique */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* En-tête avec logo et informations */}
                    <div className="flex items-start gap-4">
                        <Image className="rounded-xl shadow" src={asset.logo} alt={asset.symbol} width={48} height={48} />
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold">{asset.name}</h1>
                            <p className="text-2xl font-bold">
                                {Number(performanceData.totalValue ?? lastClosingPrice.closingPrice).toFixed(2)} €
                            </p>
                            <div className="flex gap-2">
                                <PriceChange value={performanceData.valueEur} />
                                <span
                                    className={`font-semibold text-s ${performanceData.valuePercent > 0 ? "text-green-500" : performanceData.valuePercent < 0 ? "text-red-500" : "text-muted-foreground"}`}
                                >
                                    ({performanceData.valuePercent > 0 ? "+" : ""}
                                    {performanceData.valuePercent.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Boutons de période */}
                    <div className="flex  gap-2">
                        {ASSET_PRICE_PERIODS.map((period) => (
                            <Button
                                variant={selectedPeriod === period.value ? "link" : "ghost"}
                                key={period.value}
                                onClick={() => setSelectedPeriod(period.value)}
                                className={`text-xs rounded font-bold`}
                            >
                                {period.label}
                            </Button>
                        ))}
                    </div>

                    {/* Graphique */}
                    <Suspense fallback={<SkeletonChart />}>
                        <AssetPriceChart data={formatAssetPrices} handlePerformanceData={handlePerformanceData} />
                    </Suspense>
                </div>

                {/* Partie droite: Formulaire et Position */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:w-[350px]">
                    <div className="flex-1 sm:flex-1 lg:flex-none">
                        <Suspense fallback={<SkeletonCard />}>
                            <TradeExecutionForm />
                        </Suspense>
                    </div>
                    <div className="flex-1 sm:flex-1 lg:flex-none">
                        {portfolioAsset?.assetId && (
                            <Suspense fallback={<SkeletonCard />}>
                                <PositionDetails />
                            </Suspense>
                        )}
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}
