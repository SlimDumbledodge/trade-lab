import { useQuery } from "@tanstack/react-query"
import { ASSET_PRICE_PERIOD } from "@/types/types"
import { getAssetPrices, getMarketStatus } from "@/lib/api"

export function useMarketStatus(token?: string) {
    return useQuery({
        queryKey: ["marketStatus"],
        queryFn: () => getMarketStatus(token),
        enabled: !!token,
        refetchInterval: 60_000,
    })
}
