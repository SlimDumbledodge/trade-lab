"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { PriceChange } from "../ui/price-change"
import { usePortfolioAsset } from "@/hooks/usePortfolioAsset"
export const PositionDetails = () => {
    const params = useParams()
    const symbol = params?.symbol as string
    const { data: session } = useSession()
    const router = useRouter()
    const {
        data: portofolioAsset,
        isLoading: isPortfolioAssetLoading,
        error: errorPortfolioAsset,
    } = usePortfolioAsset(symbol, session?.accessToken)

    if (isPortfolioAssetLoading) return <p>Chargement...</p>
    if (errorPortfolioAsset) return <p className="text-red-600">{errorPortfolioAsset?.message}</p>
    if (!portofolioAsset) return <p>Erreur : aucun actif trouvé.</p>
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
                <div className="flex justify-around">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-sm font-bold">{Number(portofolioAsset.holdingValue).toFixed(2)} €</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-sm text-muted-foreground">Performance</span>
                        <span className="text-sm font-bold">
                            <PriceChange value={Number(portofolioAsset.unrealizedPnl).toFixed(2)} />
                        </span>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-sm text-muted-foreground">Actions</span>
                        <span className="text-sm font-bold">{Number(portofolioAsset.quantity).toFixed(6)}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-sm text-muted-foreground">Achat moyen</span>
                        <span className="text-sm font-bold">{Number(portofolioAsset.averageBuyPrice).toFixed(2)} €</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-sm text-muted-foreground">% Portf.</span>
                        <span className="text-sm font-bold">{Number(portofolioAsset.weight).toFixed(3)} %</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
