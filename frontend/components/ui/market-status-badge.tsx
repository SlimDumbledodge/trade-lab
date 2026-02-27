"use client"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useMarketStatus } from "@/hooks/useMarketStatus"
import moment from "moment"
import { useSession } from "next-auth/react"

const MarketStatusBadge = () => {
    const { data: session } = useSession()
    const { data: marketStatus, error } = useMarketStatus(session?.accessToken)

    if (error || !marketStatus)
        return <Badge className="border-none bg-destructive/10 text-destructive whitespace-nowrap">Erreur statut marché</Badge>
    const { isOpen, todayMarketInfos, nextDayMarketInfos } = marketStatus

    const formatTime = (date: Date | string | null | undefined) => (date ? moment(date).format("HH[h]mm") : "--:--")
    const todayOpen = formatTime(todayMarketInfos?.openTime)
    const todayClose = formatTime(todayMarketInfos?.closeTime)
    const nextOpenDate = moment(nextDayMarketInfos?.openTime).format("dddd DD/MM")
    const nextOpenDateShort = moment(nextDayMarketInfos?.openTime).format("ddd DD/MM")
    const nextOpenTime = formatTime(nextDayMarketInfos?.openTime)

    if (isOpen) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge className="border-none rounded-full whitespace-nowrap bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 focus-visible:outline-none [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5">
                        <span
                            className="size-1.5 mr-1 rounded-full animate-ping bg-green-600 dark:bg-green-400"
                            aria-hidden="true"
                        />
                        <span className="sm:hidden">
                            Ouvert {todayOpen}-{todayClose}
                        </span>
                        <span className="hidden sm:inline">
                            Marché ouvert de {todayOpen} à {todayClose}
                        </span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    Marché ouvert de {todayOpen} à {todayClose}
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge className="border-none rounded-full whitespace-nowrap bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:outline-none [a&]:hover:bg-destructive/5">
                    <span className="size-1.5 rounded-full bg-destructive mr-1" aria-hidden="true" />
                    <span className="sm:hidden">
                        Fermé · {nextOpenDateShort} {nextOpenTime}
                    </span>
                    <span className="hidden sm:inline">
                        Marché fermé - Ouvre le {nextOpenDate} à {nextOpenTime}
                    </span>
                </Badge>
            </TooltipTrigger>
            <TooltipContent>
                Marché fermé - Ouvre le {nextOpenDate} à {nextOpenTime}
            </TooltipContent>
        </Tooltip>
    )
}

export default MarketStatusBadge
