"use client"

import { useState } from "react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolioAssets } from "@/hooks/usePortfolioAssets"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PriceChange } from "../ui/price-change"
import { TrendSelector } from "@/components/ui/trend-selector"
import { getTrendValue } from "@/lib/utils"

export type TrendValue = "daily_pct" | "daily_eur" | "since_buy_pct" | "since_buy_eur"

export const PortfolioAssetCard = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const { data: portfolioAssets, error: errorPortfolioAssets } = usePortfolioAssets(session?.accessToken)
    const [trend, setTrend] = useState<TrendValue>("daily_pct")

    if (errorPortfolioAssets) return <p className="text-red-600">{errorPortfolioAssets?.message}</p>
    if (!portfolioAssets) return <p>Erreur : aucun actif trouvé.</p>
    return (
        <Card className="w-full lg:max-w-xs">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Investissements</CardTitle>
                <CardAction className="self-center">
                    <TrendSelector value={trend} onValueChange={(v) => setTrend(v as TrendValue)} />
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-1">
                {portfolioAssets.map((portfolioAsset) => (
                    <div
                        key={portfolioAsset.id}
                        onClick={() => router.push(`/market/${portfolioAsset.asset.symbol}`)}
                        className="flex items-center gap-3 cursor-pointer rounded-lg p-2 -mx-2 transition-colors hover:bg-accent/50"
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                className="rounded-xl shadow"
                                src={portfolioAsset.asset.logo}
                                alt={portfolioAsset.asset.symbol}
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="flex-1 space-y-0.5">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium leading-tight">{portfolioAsset.asset.name}</p>
                                <div className="flex items-center gap-1 shrink-0">
                                    <PriceChange
                                        value={getTrendValue(portfolioAsset, trend).value}
                                        unit={getTrendValue(portfolioAsset, trend).unit}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground text-xs">
                                    x{Number(portfolioAsset.quantity).toFixed(6)}
                                </span>
                                <span className="font-semibold">{Number(portfolioAsset.holdingValue).toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
