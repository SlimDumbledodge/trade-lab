"use client"
import { Badge } from "@/components/ui/badge"
import { useMarketStatus } from "@/hooks/useMarketStatus"
import moment from "moment"
import { useSession } from "next-auth/react"

const MarketStatusBadge = () => {
    const { data: session } = useSession()
    const { data: marketStatus, error } = useMarketStatus(session?.accessToken)

    if (error || !marketStatus)
        return (
            <Badge className="border-none bg-destructive/10 text-destructive">Impossible de récupérer le statut du marché</Badge>
        )
    const { isOpen, todayMarketInfos, nextDayMarketInfos } = marketStatus

    const formatTime = (date: Date | string | null | undefined) => (date ? moment(date).format("HH[h]mm") : "--:--")
    const todayOpen = formatTime(todayMarketInfos?.openTime)
    const todayClose = formatTime(todayMarketInfos?.closeTime)
    const nextOpenDate = moment(nextDayMarketInfos?.openTime).format("dddd DD/MM")
    const nextOpenTime = formatTime(nextDayMarketInfos?.openTime)
    return isOpen ? (
        <Badge className="border-none rounded-full bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 focus-visible:outline-none [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5">
            <span className="size-1.5 mr-1 rounded-full animate-ping bg-green-600 dark:bg-green-400" aria-hidden="true" />
            Marché ouvert de {todayOpen} à {todayClose}
        </Badge>
    ) : (
        <Badge className="border-none rounded-full bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:outline-none [a&]:hover:bg-destructive/5">
            <span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />
            Marché fermé - Ouvre le {nextOpenDate} à {nextOpenTime}
        </Badge>
    )
}

export default MarketStatusBadge
