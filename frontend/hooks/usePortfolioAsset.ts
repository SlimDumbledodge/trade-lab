import { getPortfolioAsset } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function usePortfolioAsset(symbol: string, token?: string) {
    return useQuery({
        queryKey: ["portfolioAsset"],
        queryFn: () => getPortfolioAsset(symbol, token),
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })
}
