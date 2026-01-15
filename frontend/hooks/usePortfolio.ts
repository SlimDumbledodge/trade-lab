import { useQuery } from "@tanstack/react-query"
import { getPortfolio } from "@/lib/api"

export function usePortfolio(token?: string) {
    return useQuery({
        queryKey: ["portfolio"],
        queryFn: () => getPortfolio(token),
        refetchInterval: 60_000,
    })
}
