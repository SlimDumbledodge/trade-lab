import { useQuery } from "@tanstack/react-query"
import { getOrders } from "@/lib/api"

export function useOrders(assetId: number | undefined, token?: string) {
    return useQuery({
        queryKey: ["orders", assetId],
        queryFn: () => getOrders(assetId!, token),
        enabled: !!token && !!assetId,
    })
}
