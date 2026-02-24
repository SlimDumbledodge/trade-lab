import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAlert } from "@/lib/api"
import { AlertFormSchema } from "@/lib/validations/create-alert-form.schema"
import { Alert } from "@/types/types"

export const useCreateAlert = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, token }: { data: AlertFormSchema; token?: string }) =>
            createAlert(
                {
                    type: "PRICE",
                    config: {
                        symbol: data.symbol,
                        targetPrice: data.targetPrice,
                        direction: data.direction,
                    },
                },
                token,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alerts"] })
        },
    })
}
