"use client"

import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useOrders } from "@/hooks/useOrders"
import { useAsset } from "@/hooks/useAsset"
import { useDeleteOrder } from "@/mutations/useOrder"
import { Order, OrderAction, OrderType } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
    [OrderType.LIMIT]: "Limite",
    [OrderType.STOP]: "Stop",
}

const ORDER_ACTION_LABELS: Record<OrderAction, string> = {
    [OrderAction.BUY]: "Acheter",
    [OrderAction.SELL]: "Vendre",
}

export default function PendingOrdersCard() {
    const params = useParams()
    const symbol = params?.symbol as string
    const { data: session } = useSession()
    const { data: asset } = useAsset(symbol, session?.accessToken)
    const { data: orders } = useOrders(asset?.id, session?.accessToken)
    const deleteOrder = useDeleteOrder()

    if (!orders || orders.length === 0) return null

    const handleDelete = (orderId: number) => {
        deleteOrder.mutate(
            { orderId, token: session?.accessToken },
            {
                onSuccess: () => toast.success("Ordre annulé"),
                onError: () => toast.error("Erreur lors de l'annulation"),
            },
        )
    }

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold">Ordres en attente</h3>
            <div className="space-y-2">
                {orders.map((order) => (
                    <PendingOrderRow key={order.id} order={order} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    )
}

function PendingOrderRow({ order, onDelete }: { order: Order; onDelete: (id: number) => void }) {
    return (
        <div className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 transition-all hover:border-primary/20 hover:shadow-sm">
            <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-semibold">{ORDER_TYPE_LABELS[order.type]}</p>
                <div className="flex items-center gap-2">
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
