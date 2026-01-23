import { MarketCalendar } from "prisma/generated/client"

export type MarketStatusType = {
    isOpen: boolean
    todayMarketInfos: PublicMarketCalendarInfo | null
    nextDayMarketInfos: PublicMarketCalendarInfo
    previousDayMarketInfos: PublicMarketCalendarInfo
}

export type PublicMarketCalendarInfo = {
    date: string
    openTime: Date
    closeTime: Date
}
