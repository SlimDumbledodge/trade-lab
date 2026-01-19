import { useQuery } from "@tanstack/react-query"
import { getPortfolio } from "@/lib/api"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"

export function usePortfolio(period: PORTFOLIO_PERFORMANCE_PERIOD, token?: string) {
    return useQuery({
        queryKey: ["portfolio", period],
        queryFn: () => getPortfolio(period, token),
        enabled: !!token,
        refetchInterval: 60_000,
    })
}
