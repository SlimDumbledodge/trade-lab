"use client"

import { Order, OrderAction, OrderType } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
    [OrderType.LIMIT]: "Limite",
    [OrderType.STOP]: "Stop",
}

const ORDER_ACTION_LABELS: Record<OrderAction, string> = {
    [OrderAction.BUY]: "Acheter",
    [OrderAction.SELL]: "Vendre",
}

interface PendingOrderRowProps {
    order: Order
    onDelete: (id: number) => void
    showAsset?: boolean
    style?: React.CSSProperties
}

export function PendingOrderRow({ order, onDelete, showAsset = false, style }: PendingOrderRowProps) {
    return (
        <div
            className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 transition-all hover:border-primary/20 hover:shadow-sm"
            style={style}
        >
            {showAsset && order.asset && (
                <Image
                    className="rounded-lg shadow shrink-0"
                    src={order.asset.logo}
                    alt={order.asset.symbol}
                    width={32}
                    height={32}
                />
            )}
            <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-semibold">
                    {showAsset && order.asset ? order.asset.name : ORDER_TYPE_LABELS[order.type]}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                    {showAsset && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                            {ORDER_TYPE_LABELS[order.type]}
                        </Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                        {ORDER_ACTION_LABELS[order.action]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">x {Number(order.quantity)}</span>
                    <span className="text-sm font-bold tabular-nums">{Number(order.targetPrice).toFixed(2)} €</span>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={() => onDelete(order.id)}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    )
}
