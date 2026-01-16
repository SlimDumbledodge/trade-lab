import { useMutation, useQueryClient } from "@tanstack/react-query"
import { processTradeExecution } from "@/lib/api"
import { TransactionType, Transaction } from "@/types/types"

export const useTradeExecution = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            transactionType,
            assetId,
            quantity,
            token,
        }: {
            transactionType: TransactionType
            assetId: number
            quantity: number
            token?: string
        }) => processTradeExecution(transactionType, assetId, quantity, token),

        onSuccess: (data: Transaction) => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] })
            queryClient.invalidateQueries({ queryKey: ["portfolioAsset"] })
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        },
    })
}
