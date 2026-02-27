import { useQuery } from "@tanstack/react-query"
import { getAllOrders } from "@/lib/api"

export function useAllOrders(token?: string) {
    return useQuery({
        queryKey: ["orders"],
        queryFn: () => getAllOrders(token),
        enabled: !!token,
    })
}
