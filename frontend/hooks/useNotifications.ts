import { getNotifications } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useNotifications(token?: string) {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => getNotifications(token),
        enabled: !!token,
        refetchInterval: 30_000,
    })
}
