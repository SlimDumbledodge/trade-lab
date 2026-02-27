"use client"

import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useOrders } from "@/hooks/useOrders"
import { useAsset } from "@/hooks/useAsset"
import { useDeleteOrder } from "@/mutations/useOrder"
import { PendingOrderRow } from "@/components/orders/PendingOrderRow"
import toast from "react-hot-toast"

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
