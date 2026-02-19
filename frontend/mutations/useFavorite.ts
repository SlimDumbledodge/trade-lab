import { processAddFavorite, processRemoveFavorite } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddFavorite = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ assetId, token }: { assetId: number; token?: string }) => processAddFavorite(assetId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] })
        },
    })
}

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ assetId, token }: { assetId: number; token?: string }) => processRemoveFavorite(assetId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] })
        },
    })
}
