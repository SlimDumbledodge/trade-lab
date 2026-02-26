import { getInvestmentPlans } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useInvestmentPlans(token?: string) {
    return useQuery({
        queryKey: ["investment-plans"],
        queryFn: () => getInvestmentPlans(token),
        enabled: !!token,
    })
}
