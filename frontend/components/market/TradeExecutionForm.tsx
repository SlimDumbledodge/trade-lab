"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useAsset } from "@/hooks/useAsset"
import { useParams } from "next/navigation"
import { PORTFOLIO_PERFORMANCE_PERIOD, TransactionType } from "@/types/types"
import { usePortfolioAsset } from "@/hooks/usePortfolioAsset"
import { TradeExecutionConfirmation } from "./TradeExecutionConfirmation"
import { Card, CardContent } from "../ui/card"

enum FormMode {
    MONTANT,
    AUMARCHE,
}

export default function TradeExecutionForm() {
    const params = useParams()
    const symbol = params?.symbol as string
    const { data: session } = useSession()
    const {
        data: portfolio,
        isLoading: isPortfolioLoading,
        error: portfolioError,
    } = usePortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, session?.accessToken)
    const { data: asset, isLoading: isAssetLoading, error: assetError } = useAsset(symbol, session?.accessToken)
    const {
        data: portfolioAsset,
        isLoading: isPortfolioAssetLoading,
        error: portfolioAssetError,
    } = usePortfolioAsset(symbol, session?.accessToken)

    const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.BUY)
    const [formMode, setFormMode] = useState<FormMode>(FormMode.MONTANT)
    const [montant, setMontant] = useState<string>("")

    const [nbActions, setNbActions] = useState<string | number>("")
    const [montantIndicatif, setMontantIndicatif] = useState<number>(0)

    const [open, setOpen] = useState<boolean>(false)
    const lastPrice = Number(asset?.lastPrice)
    const cashBalance = Number(portfolio?.cashBalance) || 0

    const displayAvailableCashBalance = `${cashBalance.toFixed(2)} € disponibles.`
    const portfolioAssetQuantity = `${Number(portfolioAsset?.quantity).toFixed(6)} actions disponibles.`

    if (isPortfolioLoading || isAssetLoading || isPortfolioAssetLoading) return <p>Chargement...</p>
    if (assetError || portfolioError || portfolioAssetError)
        return <p className="text-red-600">{assetError?.message || portfolioError?.message || portfolioAssetError?.message}</p>
    if (!asset) return <p>Erreur : aucun actif trouvé.</p>
    return (
        <Card className="h-full">
            <CardContent>
                <div className="w-full">
                    <Tabs value={transactionType} onValueChange={(value) => setTransactionType(value as TransactionType)}>
                        <TabsList className="w-full">
                            <TabsTrigger value={TransactionType.BUY} className="flex-1">
                                Acheter
                            </TabsTrigger>
                            <TabsTrigger value={TransactionType.SELL} disabled={!portfolioAsset?.quantity} className="flex-1">
                                Vendre
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={transactionType} className="space-y-4">
                            <p className="text-sm">
                                {transactionType === TransactionType.BUY ? displayAvailableCashBalance : portfolioAssetQuantity}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant={formMode === FormMode.MONTANT ? "default" : "secondary"}
                                    onClick={() => {
                                        setFormMode(FormMode.MONTANT)
                                        setNbActions("")
                                        setMontantIndicatif(0)
                                        setMontant("")
                                    }}
                                    size="sm"
                                >
                                    Montant
                                </Button>
                                <Button
                                    variant={formMode === FormMode.AUMARCHE ? "default" : "secondary"}
                                    onClick={() => {
                                        setFormMode(FormMode.AUMARCHE)
                                        setMontant("")
                                        setNbActions("")
                                        setMontantIndicatif(0)
                                    }}
                                    size="sm"
                                >
                                    Au marché
                                </Button>
                            </div>

                            {formMode === FormMode.MONTANT && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Montant (€)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={montant}
                                                onChange={(e) => {
                                                    setMontant(e.target.value)
                                                    setNbActions(Number(e.target.value) / lastPrice)
                                                }}
                                                min={0}
                                                step="any"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Au marché</span>
                                        <span className="font-medium">{Number(nbActions).toFixed(6)}</span>
                                    </div>
                                </>
                            )}
                            {formMode === FormMode.AUMARCHE && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Actions</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={nbActions}
                                                onChange={(e) => {
                                                    setNbActions(e.target.value)
                                                    setMontantIndicatif(Number(e.target.value) * lastPrice)
                                                }}
                                                min={0}
                                                step="any"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Prix du marché</span>
                                        <span className="font-medium">{lastPrice} €</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Montant (indicatif)</span>
                                        <span className="font-medium">{montantIndicatif.toFixed(2)} €</span>
                                    </div>
                                </>
                            )}

                            <Button disabled={false} onClick={() => setOpen(true)} className="w-full">
                                Valider l'ordre
                            </Button>
                            {/* <p className="text-sm text-center mt-2">La bourse est actuellement fermée.</p> */}
                        </TabsContent>
                    </Tabs>
                    <TradeExecutionConfirmation
                        transactionType={transactionType}
                        nbActions={Number(nbActions)}
                        open={open}
                        setOpen={setOpen}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
