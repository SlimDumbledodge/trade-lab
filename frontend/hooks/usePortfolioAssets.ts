import { getPortfolioAsset, getPortfolioAssets } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function usePortfolioAssets(token?: string) {
    return useQuery({
        queryKey: ["portfolioAssets"],
        queryFn: () => getPortfolioAssets(token),
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })
}
