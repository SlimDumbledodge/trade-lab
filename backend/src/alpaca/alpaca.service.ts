import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import axios from "axios"
import { HistoricalBarsType, AlpacaBarsResponse, CalendarInfo, LatestQuoteType } from "./types/alpaca.types"
import { mapTimeframes } from "src/utils/mapTimeframes"
import { ConfigService } from "@nestjs/config"

import { Decimal } from "@prisma/client/runtime/client"
import { Asset } from "prisma/generated/client"
const moment = require("moment-timezone")
@Injectable()
export class AlpacaService {
    private readonly BASE_BARS_STOCK_URL: string
    private readonly BASE_MARKET_CALENDAR_INFO_URL: string
    private readonly BASE_LATEST_QUOTE_URL: string
    private readonly logger = new Logger(AlpacaService.name)

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        this.BASE_BARS_STOCK_URL = this.configService.get<string>("APCA_BASE_BARS_STOCK_URL")!
        this.BASE_MARKET_CALENDAR_INFO_URL = this.configService.get<string>("APCA_BASE_MARKET_CALENDAR_INFO")!
        this.BASE_LATEST_QUOTE_URL = this.configService.get<string>("APCA_BASE_LATEST_QUOTE")!
    }

    async getHistoricalBars(params: HistoricalBarsType) {
        const {
            symbols,
            timeframe,
            start,
            end,
            limit = 10000,
            adjustment = "all",
            asof,
            feed = "iex",
            currency = "EUR",
            sort = "asc",
        } = params

        const symbolsString = symbols.join(",")
        const formattedTimeframe = mapTimeframes(timeframe)
        let pageToken: string | undefined = undefined
        let hasToken = true
        try {
            while (hasToken) {
                const response = await axios.get<AlpacaBarsResponse>(this.BASE_BARS_STOCK_URL, {
                    params: {
                        symbols: symbolsString,
                        timeframe: formattedTimeframe,
                        start,
                        end,
                        limit,
                        adjustment,
                        asof,
                        feed,
                        currency,
                        page_token: pageToken,
                        sort,
                    },
                    headers: {
                        accept: "application/json",
                        "APCA-API-KEY-ID": this.configService.get<string>("APCA_API_KEY_ID"),
                        "APCA-API-SECRET-KEY": this.configService.get<string>("APCA_API_SECRET_KEY"),
                    },
                })
                pageToken = response.data.next_page_token
                hasToken = !!pageToken
                const bars = response.data.bars
                for (const symbol in bars) {
                    const asset = await this.prisma.asset.findUnique({ where: { symbol } })
                    if (!asset) {
                        this.logger.warn(`⚠️ Aucun asset trouvé pour ${symbol}, insertion ignorée.`)
                        continue
                    }

                    const lastClosingPrice = bars[symbol][bars[symbol].length - 1].c

                    const upsertOperations = bars[symbol].map((bar) => {
                        const recordedAt = new Date(bar.t)
                        return this.prisma.assetPrice.upsert({
                            where: { assetId_timeframe_recordedAt: { assetId: asset.id, timeframe, recordedAt } },
                            update: {
                                open: bar.o,
                                high: bar.h,
                                low: bar.l,
                                close: bar.c,
                                volume: bar.v,
                            },
                            create: {
                                assetId: asset.id,
                                timeframe,
                                open: bar.o,
                                high: bar.h,
                                low: bar.l,
                                close: bar.c,
                                volume: bar.v,
                                recordedAt,
                            },
                        })
                    })
                    await Promise.allSettled(upsertOperations)
                    await this.prisma.asset.update({
                        where: { id: asset.id },
                        data: {
                            lastPrice: lastClosingPrice,
                            updatedAt: new Date(),
                        },
                    })
                }
            }
        } catch (error: any) {
            this.logger.error(`❌ Erreur getHistoricalBars:`, error)
            throw new Error(error?.response?.data?.message || error?.message || "Erreur inconnue")
        }
    }

    async getLastDayOpeningMarket(): Promise<moment.Moment> {
        try {
            const response = await axios.get(this.BASE_MARKET_CALENDAR_INFO_URL, {
                params: {
                    start: moment().subtract(1, "month").format("YYYY-MM-DD"),
                    end: moment().format("YYYY-MM-DD"),
                },
                headers: {
                    accept: "application/json",
                    "APCA-API-KEY-ID": this.configService.get<string>("APCA_API_KEY_ID"),
                    "APCA-API-SECRET-KEY": this.configService.get<string>("APCA_API_SECRET_KEY"),
                },
            })

            const calendars: CalendarInfo[] = response.data
            if (!calendars?.length) throw new Error("Aucun jour de marché renvoyé par l’API")

            const nowParis = moment.tz("Europe/Paris")
            const todayStr = nowParis.format("YYYY-MM-DD")

            const todayCalendar = calendars.find((d) => d.date === todayStr)
            const lastOpenDay = calendars[calendars.length - 1]

            if (!todayCalendar) {
                return moment.tz(lastOpenDay.date, "YYYY-MM-DD", "Europe/Paris").startOf("day")
            }

            const marketOpenParis = moment
                .tz(`${todayCalendar.date} ${todayCalendar.open}`, "YYYY-MM-DD HH:mm", "America/New_York")
                .tz("Europe/Paris")

            if (nowParis.isBefore(marketOpenParis)) {
                const prevDay = calendars.filter((d) => moment(d.date).isBefore(todayStr)).pop()
                if (!prevDay) throw new Error("Impossible de déterminer le jour ouvré précédent")
                return moment.tz(prevDay.date, "YYYY-MM-DD", "Europe/Paris").startOf("day")
            }

            return moment.tz(todayCalendar.date, "YYYY-MM-DD", "Europe/Paris").startOf("day")
        } catch (error: any) {
            const msg = error?.response?.data ?? error.message
            this.logger.error(`Erreur lors de la récupération du calendrier du marché : ${msg}`)
            throw new Error(msg)
        }
    }

    async getLatestQuote(params: LatestQuoteType) {
        if (!params?.symbols?.length) {
            this.logger.warn("getLatestQuote appelé sans symboles.")
            return
        }
        const symbols = params.symbols.join(",")
        try {
            const response = await axios.get(this.BASE_LATEST_QUOTE_URL, {
                params: {
                    symbols,
                    feed: "iex",
                    currency: "EUR",
                },
                headers: {
                    accept: "application/json",
                    "APCA-API-KEY-ID": this.configService.get<string>("APCA_API_KEY_ID"),
                    "APCA-API-SECRET-KEY": this.configService.get<string>("APCA_API_SECRET_KEY"),
                },
            })
            const quotes = response.data?.quotes ?? {}
            const updates: Promise<Asset>[] = []
            for (const symbol in quotes) {
                const quote = quotes[symbol]
                if (!quote) continue

                const asset = await this.prisma.asset.findUnique({ where: { symbol } })
                if (!asset) {
                    this.logger.warn(`getLatestQuote ⚠️ Aucun asset trouvé pour ${symbol}, quote ignorée.`)
                    continue
                }
                const bidPrice = new Decimal(quote.bp)
                const askPrice = new Decimal(quote.ap)

                // Vérifie que les données sont cohérentes avant d’updater
                if (!bidPrice || !askPrice) {
                    this.logger.warn(`getLatestQuote ⚠️ Données incomplètes pour ${symbol}`)
                    continue
                }
                const bidVolume = new Decimal(quote.bs) || 0
                const askVolume = new Decimal(quote.as) || 0
                const quoteTimestamp = quote.t ? new Date(quote.t) : new Date()
                const midPrice = bidPrice.add(askPrice).div(new Decimal(2))
                const quoteVolume = Math.min(Number(bidVolume), Number(askVolume))

                updates.push(
                    this.prisma.asset.update({
                        where: { id: asset.id },
                        data: {
                            midPrice,
                            bidPrice,
                            askPrice,
                            quoteTimestamp,
                            quoteVolume,
                            updatedAt: new Date(),
                        },
                    }),
                )
            }
            if (updates.length > 0) {
                await Promise.all(updates)
                this.logger.log(`getLatestQuote ✅ Quotes mises à jour pour ${updates.length} symboles.`)
            }
        } catch (e) {
            this.logger.error(`getLatestQuote ❌ Erreur lors de la récupération des quotes : ${e.message}`, e.stack)
        }
    }

    async insertMarketCalendar() {
        try {
            const response = await axios.get(this.BASE_MARKET_CALENDAR_INFO_URL, {
                params: {
                    start: moment().subtract(1, "month").format("YYYY-MM-DD"),
                    end: moment().format("2029-12-31"),
                },
                headers: {
                    accept: "application/json",
                    "APCA-API-KEY-ID": this.configService.get<string>("APCA_API_KEY_ID"),
                    "APCA-API-SECRET-KEY": this.configService.get<string>("APCA_API_SECRET_KEY"),
                },
            })

            const calendarDays: CalendarInfo[] = response.data
            if (!calendarDays?.length) throw new Error("Aucun jour de marché renvoyé par l’API")

            const formattedCalendars: { date: string; openTime: Date; closeTime: Date }[] = calendarDays.map((day) => {
                const openTime = moment.tz(`${day.date} ${day.open}`, "YYYY-MM-DD HH:mm", "America/New_York").tz("Europe/Paris").toDate()

                const closeTime = moment.tz(`${day.date} ${day.close}`, "YYYY-MM-DD HH:mm", "America/New_York").tz("Europe/Paris").toDate()

                return {
                    date: day.date,
                    openTime,
                    closeTime,
                }
            })

            return await this.prisma.marketCalendar.createMany({
                data: formattedCalendars,
                skipDuplicates: true,
            })
        } catch (error: any) {
            const msg = error?.response?.data ?? error.message
            this.logger.error(`Erreur lors de la récupération du calendrier du marché : ${msg}`)
            throw new Error(msg)
        }
    }
}
