import { createOrder, deleteOrder } from "@/lib/api"
import { OrderAction, OrderExpiresType, OrderType } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            data,
            token,
        }: {
            data: {
                assetId: number
                type: OrderType
                action: OrderAction
                expiresType: OrderExpiresType
                quantity: string
                targetPrice: string
            }
            token?: string
        }) => createOrder(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}

export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, token }: { orderId: number; token?: string }) => deleteOrder(orderId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}
