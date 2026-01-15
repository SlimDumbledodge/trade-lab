import { useQuery } from "@tanstack/react-query"
import { getAssets } from "@/lib/api"

export function useAssets(token?: string) {
    return useQuery({
        queryKey: ["assets"],
        queryFn: () => getAssets(token),
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    })
}
