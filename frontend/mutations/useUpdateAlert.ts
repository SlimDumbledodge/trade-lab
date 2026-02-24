import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAlert } from "@/lib/api"
import { Alert } from "@/types/types"

export const useUpdateAlert = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            alertId,
            data,
            token,
        }: {
            alertId: number
            data: {
                status?: "ACTIVE" | "DISABLED"
                config?: { symbol?: string; targetPrice?: number; direction?: "ABOVE" | "BELOW" }
            }
            token?: string
        }) => updateAlert(alertId, data, token),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alerts"] })
        },
    })
}
