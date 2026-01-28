import { getPortfolioAsset } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function usePortfolioAsset(symbol: string, token?: string) {
    return useQuery({
        queryKey: ["portfolioAsset", symbol],
        queryFn: () => getPortfolioAsset(symbol, token),
        enabled: !!token,
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })
}
