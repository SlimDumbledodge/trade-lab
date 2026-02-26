import { createInvestmentPlan, updateInvestmentPlan, deleteInvestmentPlan } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateInvestmentPlan = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            data,
            token,
        }: {
            data: { assetId: number; frequency: string; firstExecution: string; amount: number }
            token?: string
        }) => createInvestmentPlan(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["investment-plans"] })
        },
    })
}

export const useUpdateInvestmentPlan = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            planId,
            data,
            token,
        }: {
            planId: number
            data: { frequency: string; firstExecution: string; amount: number }
            token?: string
        }) => updateInvestmentPlan(planId, data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["investment-plans"] })
        },
    })
}

export const useDeleteInvestmentPlan = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ planId, token }: { planId: number; token?: string }) => deleteInvestmentPlan(planId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["investment-plans"] })
        },
    })
}
