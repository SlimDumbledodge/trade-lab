import { useQuery } from "@tanstack/react-query"
import { getAsset } from "@/lib/api"

export function useAsset(symbol: string, token?: string) {
    return useQuery({
        queryKey: ["asset", symbol],
        queryFn: () => getAsset(symbol, token),
        enabled: !!token,
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })
}
