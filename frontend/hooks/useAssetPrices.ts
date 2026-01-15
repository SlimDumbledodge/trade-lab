import { useQuery } from "@tanstack/react-query"
import { ASSET_PRICE_PERIOD } from "@/types/types"
import { getAssetPrices } from "@/lib/api"

export function useAssetPrices(symbol: string, period: ASSET_PRICE_PERIOD, token?: string) {
    return useQuery({
        queryKey: ["assetPrices", symbol, period],
        queryFn: () => getAssetPrices(symbol, period, token),
        enabled: !!symbol && !!token,
        refetchInterval: 60_000,
    })
}
