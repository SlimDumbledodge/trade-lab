import { BadRequestException, Injectable } from "@nestjs/common"
import * as moment from "moment"
import { PrismaService } from "src/prisma/prisma.service"
import { ASSET_PRICE_PERIOD } from "./types/types"

@Injectable()
export class AssetsPriceService {
    constructor(private readonly prisma: PrismaService) {}

    async getAssetPrices(symbol: string, timeframe: ASSET_PRICE_PERIOD) {
        const asset = await this.prisma.asset.findFirst({ where: { symbol } })

        if (!asset) throw new BadRequestException(`getAssetPrices : Asset introuvable avec le symbol ${symbol}`)

        const now = moment()
        let fromDate: moment.Moment
        switch (timeframe) {
            case ASSET_PRICE_PERIOD.ONE_DAY:
                fromDate = now.clone().startOf("day")
                break
            case ASSET_PRICE_PERIOD.ONE_WEEK:
                fromDate = now.clone().subtract(1, "week")
                break
            case ASSET_PRICE_PERIOD.ONE_MONTH:
                fromDate = now.clone().subtract(1, "month")
                break
            case ASSET_PRICE_PERIOD.SIX_MONTHS:
                fromDate = now.clone().subtract(6, "months")
                break
            case ASSET_PRICE_PERIOD.ONE_YEAR:
                fromDate = now.clone().subtract(1, "year")
                break
            case ASSET_PRICE_PERIOD.FIVE_YEARS:
                fromDate = now.clone().subtract(5, "years")
                break
            default:
                throw new BadRequestException(`getAssetPrices : timeframe non pris en charge (${timeframe as string})`)
        }
        const prices = await this.prisma.assetPrice.findMany({
            where: {
                timeframe,
                assetId: asset.id,
                recordedAt: {
                    gte: fromDate.toDate(),
                    lte: now.toDate(),
                },
            },
            orderBy: { recordedAt: "asc" },
        })

        if (prices.length === 0) return []

        return prices.map((p) => ({
            recordedAt: p.recordedAt,
            closingPrice: p.close,
        }))
    }
}
