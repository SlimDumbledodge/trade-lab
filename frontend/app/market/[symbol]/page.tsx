"use client"

import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { ASSET_PRICE_PERIOD } from "@/types/types"
import { AssetPriceChart, PricePoint } from "../../../components/charts/AssetPriceChart"
import Image from "next/image"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { PriceChange } from "@/components/ui/price-change"
import TradeExecutionForm from "@/components/market/TradeExecutionForm"
import { useAssetPrices } from "@/hooks/useAssetPrices"
import { useAsset } from "@/hooks/useAsset"
import { PERIODS } from "@/lib/constants"

export default function MarketProductDetails() {
    const { data: session } = useSession()
    const params = useParams()
    const symbol = params?.symbol as string
    const [selectedPeriod, setSelectedPeriod] = useState<ASSET_PRICE_PERIOD>(ASSET_PRICE_PERIOD.ONE_DAY)
    const [performanceData, setPerformanceData] = useState<{ valueEur: number; valuePercent: number }>({
        valueEur: 0,
        valuePercent: 0,
    })
    const lastValueRef = useRef<number | null>(null)

    const handlePerformanceData = useCallback((currentPrice: number, openingPrice: number) => {
        const differenceEur = currentPrice - openingPrice
        const differencePercent = ((currentPrice - openingPrice) / openingPrice) * 100

        if (lastValueRef.current !== differenceEur) {
            lastValueRef.current = differenceEur
            setPerformanceData({ valueEur: differenceEur, valuePercent: differencePercent })
        }
    }, [])

    const { data: asset, isLoading: assetLoading, error: assetError } = useAsset(symbol, session?.accessToken)

    const {
        data: assetPrices,
        isLoading: assetPricesLoading,
        error: assetPricesError,
    } = useAssetPrices(symbol, selectedPeriod, session?.accessToken ?? undefined)

    if (assetLoading || assetPricesLoading) return <p>Chargement...</p>
    if (assetError || assetPricesError) return <p className="text-red-600">{assetError?.message || assetPricesError?.message}</p>
    if (!asset || !assetPrices) return <p>Introuvable</p>
    console.log(assetPrices)

    const formatAssetPrices: PricePoint[] = assetPrices.map((price) => {
        return {
            recordedAt: price.recordedAt,
            closingPrice: price.closingPrice,
        }
    })

    return (
        <HomeLayout headerTitle={"Marché"}>
            <div className="flex flex-col gap-6">
                {/* En-tête avec logo et informations */}
                <div className="flex items-start gap-4">
                    <Image className="rounded-xl shadow" src={asset.logo} alt={asset.symbol} width={48} height={48} />
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold">{asset.name}</h1>
                        <p className="text-2xl font-bold">{Number(asset.lastPrice).toFixed(2)} €</p>
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
                <div className="flex gap-2">
                    {PERIODS.map((period) => (
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

                {/* Graphique et formulaire */}
                <div className="flex gap-6">
                    <div className="flex-1">
                        <AssetPriceChart data={formatAssetPrices} handlePerformanceData={handlePerformanceData} />
                    </div>
                    <div>
                        <TradeExecutionForm />
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}
