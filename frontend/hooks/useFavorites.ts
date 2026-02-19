import { getFavorites } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useFavorites(token?: string) {
    return useQuery({
        queryKey: ["favorites"],
        queryFn: () => getFavorites(token),
        enabled: !!token,
    })
}
