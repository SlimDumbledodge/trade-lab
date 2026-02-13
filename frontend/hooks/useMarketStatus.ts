import { useQuery } from "@tanstack/react-query"
import { getMarketStatus } from "@/lib/api"

export function useMarketStatus(token?: string) {
    return useQuery({
        queryKey: ["marketStatus"],
        queryFn: () => getMarketStatus(token),
        enabled: !!token,
        refetchInterval: 60_000,
    })
}
