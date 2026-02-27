"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { OrderAction, OrderExpiresType, OrderType, PORTFOLIO_PERFORMANCE_PERIOD, TransactionType } from "@/types/types"
import { OrderMode } from "./OrderModeSelect"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useAsset } from "@/hooks/useAsset"
import { usePortfolioAsset } from "@/hooks/usePortfolioAsset"
import { useCreateOrder } from "@/mutations/useOrder"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createOrderFormSchema, OrderFormSchema } from "@/lib/validations/order-form.schema"
import toast from "react-hot-toast"

const ORDER_MODE_PRICE_LABELS: Record<OrderMode.LIMIT | OrderMode.STOP, string> = {
    [OrderMode.LIMIT]: "Prix limite",
    [OrderMode.STOP]: "Prix d'ordre stop",
}

const EXPIRES_TYPE_LABELS: Record<OrderExpiresType, string> = {
    [OrderExpiresType.DAY]: "Valable pour un jour",
    [OrderExpiresType.YEAR]: "Valable pour un an",
}

const ORDER_MODE_TO_TYPE: Record<OrderMode.LIMIT | OrderMode.STOP, OrderType> = {
    [OrderMode.LIMIT]: OrderType.LIMIT,
    [OrderMode.STOP]: OrderType.STOP,
}

interface OrderFormProps {
    orderMode: OrderMode.LIMIT | OrderMode.STOP
    transactionType: TransactionType
}

export default function OrderForm({ orderMode, transactionType }: OrderFormProps) {
    const params = useParams()
    const symbol = params?.symbol as string

    const { data: session } = useSession()
    const { data: portfolio } = usePortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, session?.accessToken)
    const { data: asset } = useAsset(symbol, session?.accessToken)
    const { data: portfolioAsset } = usePortfolioAsset(symbol, session?.accessToken)
    const createOrder = useCreateOrder()

    const lastPrice = Number(asset?.lastPrice)
    const cashBalance = Number(portfolio?.cashBalance) || 0
    const portfolioAssetQuantity = Number(portfolioAsset?.quantity) || 0

    const displayAvailable =
        transactionType === TransactionType.BUY
            ? `${cashBalance.toFixed(2)} € disponibles.`
            : `${portfolioAssetQuantity.toFixed(6)} actions disponibles.`

    const form = useForm<OrderFormSchema>({
        resolver: zodResolver(createOrderFormSchema(transactionType, cashBalance, lastPrice, portfolioAssetQuantity)),
        defaultValues: {
            quantity: "",
            targetPrice: "",
            expiresType: OrderExpiresType.YEAR,
        },
    })

    const quantity = form.watch("quantity")
    const targetPrice = form.watch("targetPrice")
    const estimatedAmount = Number(quantity) * Number(targetPrice) || 0

    const onSubmit = (values: OrderFormSchema) => {
        if (!asset) return

        createOrder.mutate(
            {
                data: {
                    assetId: asset.id,
                    type: ORDER_MODE_TO_TYPE[orderMode],
                    action: transactionType === TransactionType.BUY ? OrderAction.BUY : OrderAction.SELL,
                    expiresType: values.expiresType,
                    quantity: values.quantity,
                    targetPrice: values.targetPrice,
                },
                token: session?.accessToken,
            },
            {
                onSuccess: () => {
                    toast.success("Ordre créé avec succès")
                    form.reset()
                },
                onError: () => toast.error("Erreur lors de la création de l'ordre"),
            },
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-sm">{displayAvailable}</p>

                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Actions</span>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        min={0}
                                        step="any"
                                        className="w-28 text-right"
                                        {...field}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="targetPrice"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{ORDER_MODE_PRICE_LABELS[orderMode]}</span>
                                <FormControl>
                                    <div className="relative w-28">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            min={0}
                                            step="any"
                                            className="text-right pr-6"
                                            {...field}
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                            €
                                        </span>
                                    </div>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expiresType"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Expiration</span>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-auto border-0 p-0 h-auto text-sm text-primary shadow-none focus:ring-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(EXPIRES_TYPE_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-between text-sm">
                    <span>Montant (indicatif)</span>
                    <span className="font-medium">{estimatedAmount.toFixed(2)} €</span>
                </div>

                <Button type="submit" className="w-full" disabled={createOrder.isPending}>
                    {createOrder.isPending ? "Création..." : "Valider l'ordre"}
                </Button>
            </form>
        </Form>
    )
}
