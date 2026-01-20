"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useAsset } from "@/hooks/useAsset"
import { useParams } from "next/navigation"
import { PORTFOLIO_PERFORMANCE_PERIOD, TransactionType } from "@/types/types"
import { usePortfolioAsset } from "@/hooks/usePortfolioAsset"
import { TradeExecutionConfirmation } from "./TradeExecutionConfirmation"
import { Card, CardContent } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTradeFormSchema, TradeFormSchema } from "@/lib/validations/trade-execution-form.schema"

export enum FormMode {
    MONTANT,
    AUMARCHE,
}

export default function TradeExecutionForm() {
    const params = useParams()
    const symbol = params?.symbol as string
    const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.BUY)
    const [formMode, setFormMode] = useState<FormMode>(FormMode.MONTANT)
    const [open, setOpen] = useState<boolean>(false)
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

    const lastPrice = Number(asset?.lastPrice)
    const cashBalance = Number(portfolio?.cashBalance) || 0
    const portfolioAssetQuantity = Number(portfolioAsset?.quantity) || 0
    const displayAvailableCashBalance = `${cashBalance.toFixed(2)} € disponibles.`
    const displayPortfolioAssetQuantity = `${portfolioAssetQuantity.toFixed(6)} actions disponibles.`

    if (isPortfolioLoading || isAssetLoading || isPortfolioAssetLoading) return <p>Chargement...</p>
    if (assetError || portfolioError || portfolioAssetError)
        return <p className="text-red-600">{assetError?.message || portfolioError?.message || portfolioAssetError?.message}</p>
    if (!asset) return <p>Erreur : aucun actif trouvé.</p>

    const onSubmit = (values: TradeFormSchema) => {
        // Ne change rien : juste validation avant ouverture du modal
        if (formMode === FormMode.MONTANT && !values.montant) return
        if (formMode === FormMode.AUMARCHE && !values.nbActions) return
        setOpen(true)
    }

    const form = useForm({
        resolver: zodResolver(createTradeFormSchema(transactionType, formMode, cashBalance, lastPrice, portfolioAssetQuantity)),
        defaultValues: {
            montant: "",
            nbActions: "",
        },
    })

    return (
        <Card className="h-full">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                    {transactionType === TransactionType.BUY
                                        ? displayAvailableCashBalance
                                        : displayPortfolioAssetQuantity}
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        variant={formMode === FormMode.MONTANT ? "default" : "secondary"}
                                        onClick={() => {
                                            setFormMode(FormMode.MONTANT)
                                            form.reset({ montant: "", nbActions: "" })
                                        }}
                                        size="sm"
                                    >
                                        Montant
                                    </Button>
                                    <Button
                                        variant={formMode === FormMode.AUMARCHE ? "default" : "secondary"}
                                        onClick={() => {
                                            setFormMode(FormMode.AUMARCHE)
                                            form.reset({ montant: "", nbActions: "" })
                                        }}
                                        size="sm"
                                    >
                                        Au marché
                                    </Button>
                                </div>

                                {formMode === FormMode.MONTANT && (
                                    <FormField
                                        control={form.control}
                                        name="montant"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Montant (€)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        min={0}
                                                        step="any"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            form.setValue(
                                                                "nbActions",
                                                                (Number(e.target.value) / lastPrice).toString(),
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                                <div className="flex justify-between text-sm">
                                                    <span>Au marché</span>
                                                    <span className="font-medium">
                                                        {(Number(form.watch("montant")) / lastPrice || 0).toFixed(6)}
                                                    </span>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {formMode === FormMode.AUMARCHE && (
                                    <FormField
                                        control={form.control}
                                        name="nbActions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Actions</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        min={0}
                                                        step="any"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            form.setValue(
                                                                "montant",
                                                                (Number(e.target.value) * lastPrice).toString(),
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                                <div className="flex justify-between text-sm">
                                                    <span>Prix du marché</span>
                                                    <span className="font-medium">{lastPrice} €</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Montant (indicatif)</span>
                                                    <span className="font-medium">
                                                        {(Number(form.watch("nbActions")) * lastPrice || 0).toFixed(2)} €
                                                    </span>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <Button type="submit" className="w-full">
                                    Valider l’ordre
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>

                <TradeExecutionConfirmation
                    transactionType={transactionType}
                    nbActions={Number(form.watch("nbActions"))}
                    open={open}
                    setOpen={setOpen}
                    onSuccess={() => form.reset()}
                />
            </CardContent>
        </Card>
    )
}
