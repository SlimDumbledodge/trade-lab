import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import axios, { AxiosError } from "axios"
import { HistoricalBarsType, AlpacaBarsResponse } from "./types/alpaca.types"

@Injectable()
export class AlpacaService {
    private readonly BASE_URL = "https://data.alpaca.markets/v2/stocks/bars"
    private readonly logger = new Logger(AlpacaService.name)

    constructor(private readonly prisma: PrismaService) {}

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
            currency = "USD",
            page_token,
            sort = "asc",
        } = params

        const symbolsString = symbols.join(',')

        try {
            const response = await axios.get<AlpacaBarsResponse>(this.BASE_URL, {
                params: {
                    symbols: symbolsString,
                    timeframe,
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
                    "APCA-API-KEY-ID": "PKNFHKTVWXGY3D2DJR4PQQCTGT",
                    "APCA-API-SECRET-KEY": "4MizrRiCkzswTqLQLTojNx5MxrRJwwZMzSa7Nikr49vW",
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
                        where: { assetId_recordedAt: { assetId: asset.id, recordedAt } },
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
        } catch (error) {
            throw new Error(error.response.message)
        }
    }
}
