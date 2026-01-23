import { Injectable } from "@nestjs/common"
import { MarketCalendar } from "prisma/generated/client"
import { PrismaService } from "src/prisma/prisma.service"
import { MarketStatusType, PublicMarketCalendarInfo } from "./types/types"
const moment = require("moment-timezone")
@Injectable()
export class MarketStatusService {
    constructor(private readonly prisma: PrismaService) {}

    async isMarketOpen(): Promise<boolean> {
        const now = moment()

        const findToday = await this.prisma.marketCalendar.findUnique({
            where: {
                date: now.format("YYYY-MM-DD"),
            },
        })

        if (!findToday) return false

        const openDateTime = moment(findToday.openTime)
        const closeDateTime = moment(findToday.closeTime)

        return now.isBetween(openDateTime, closeDateTime)
    }

    async getMarketStatus(): Promise<MarketStatusType> {
        const isMarketOpen = await this.isMarketOpen()
        const now = moment().format("YYYY-MM-DD")
        let todayMarketInfos: PublicMarketCalendarInfo | null = null
        if (isMarketOpen) {
            todayMarketInfos = await this.prisma.marketCalendar.findFirst({
                where: {
                    date: now,
                },
                select: { date: true, openTime: true, closeTime: true },
            })
        }
        const nextDayMarketInfos = await this.getNextMarketOpenDay()
        const previousDayMarketInfos = await this.getPreviousMarketOpenDay()

        return {
            isOpen: isMarketOpen,
            todayMarketInfos,
            nextDayMarketInfos,
            previousDayMarketInfos,
        }
    }

    private async getNextMarketOpenDay(): Promise<PublicMarketCalendarInfo> {
        const now = moment().format("YYYY-MM-DD")

        const nextDay = await this.prisma.marketCalendar.findFirst({
            where: {
                date: { gt: now },
            },
            orderBy: { date: "asc" },
            select: { date: true, openTime: true, closeTime: true },
        })

        if (!nextDay) {
            throw new Error(`getNextMarketOpenDay : Imposible de déterminer le next day`)
        }

        return nextDay
    }

    private async getPreviousMarketOpenDay(): Promise<PublicMarketCalendarInfo> {
        const now = moment().format("YYYY-MM-DD")

        const previousDay = await this.prisma.marketCalendar.findFirst({
            where: {
                date: { lt: now },
            },
            orderBy: { date: "desc" },
            select: { date: true, openTime: true, closeTime: true },
        })

        if (!previousDay) {
            throw new Error(`getPreviousMarketOpenDay : Imposible de déterminer le previous day`)
        }

        return previousDay
    }
}
