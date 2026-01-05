import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import axios from "axios"
import { HistoricalBarsType, AlpacaBarsResponse, CalendarInfo } from "./types/alpaca.types"
import { mapTimeframes } from "src/utils/mapTimeframes"
import { ConfigService } from "@nestjs/config"
import * as moment from "moment-timezone"

@Injectable()
export class AlpacaService {
    private readonly BASE_BARS_STOCK_URL: string
    private readonly BASE_MARKET_CALENDAR_INFO_URL: string
    private readonly logger = new Logger(AlpacaService.name)

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        this.BASE_BARS_STOCK_URL = this.configService.get<string>("APCA_BASE_BARS_STOCK_URL")!
        this.BASE_MARKET_CALENDAR_INFO_URL = this.configService.get<string>("APCA_BASE_MARKET_CALENDAR_INFO")!
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
            page_token,
            sort = "asc",
        } = params

        const symbolsString = symbols.join(",")
        const formattedTimeframe = mapTimeframes(timeframe)
        try {
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
                    page_token,
                    sort,
                },
                headers: {
                    accept: "application/json",
                    "APCA-API-KEY-ID": this.configService.get<string>("APCA_API_KEY_ID"),
                    "APCA-API-SECRET-KEY": this.configService.get<string>("APCA_API_SECRET_KEY"),
                },
            })
            const bars = response.data.bars
            for (const symbol in bars) {
                const asset = await this.prisma.asset.findUnique({ where: { symbol } })
                if (!asset) {
                    this.logger.warn(`⚠️ Aucun asset trouvé pour ${symbol}, insertion ignorée.`)
                    continue
                }

                for (const bar of bars[symbol]) {
                    const recordedAt = new Date(bar.t)

                    await this.prisma.assetPrice.upsert({
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
}
