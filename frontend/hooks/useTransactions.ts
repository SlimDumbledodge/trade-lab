import { getTransactions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useTransactions(page: number, limit: number, token?: string) {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: () => getTransactions(page, limit, token),
    })
}
