import { getAlerts } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useAlerts(token?: string) {
    return useQuery({
        queryKey: ["alerts"],
        queryFn: () => getAlerts(token),
        enabled: !!token,
    })
}
