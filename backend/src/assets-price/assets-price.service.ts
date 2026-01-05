import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { ASSET_PRICE_PERIOD } from "./types/types"
import { AssetPrice } from "prisma/generated/client"
import { AlpacaService } from "src/alpaca/alpaca.service"
import * as moment from "moment"

@Injectable()
export class AssetsPriceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly alpacaService: AlpacaService,
    ) {}

    async getAssetPrices(symbol: string, timeframe: ASSET_PRICE_PERIOD) {
        const asset = await this.prisma.asset.findFirst({ where: { symbol } })
        if (!asset) throw new BadRequestException(`getAssetPrices : Asset introuvable avec le symbol ${symbol}`)

        const lastDayOpenedMarket = await this.alpacaService.getLastDayOpeningMarket()
        if (!lastDayOpenedMarket) throw new BadRequestException("Impossible de déterminer le dernier jour d'ouverture du marché")

        const lastMoment = moment(lastDayOpenedMarket, "YYYY-MM-DD")
        let fromMoment: moment.Moment

        switch (timeframe) {
            case ASSET_PRICE_PERIOD.ONE_DAY:
                fromMoment = lastMoment.clone()
                break
            case ASSET_PRICE_PERIOD.ONE_WEEK:
                fromMoment = lastMoment.clone().subtract(7, "days")
                break
            case ASSET_PRICE_PERIOD.ONE_MONTH:
                fromMoment = lastMoment.clone().subtract(1, "month")
                break
            case ASSET_PRICE_PERIOD.SIX_MONTHS:
                fromMoment = lastMoment.clone().subtract(6, "months")
                break
            case ASSET_PRICE_PERIOD.ONE_YEAR:
                fromMoment = lastMoment.clone().subtract(1, "year")
                break
            case ASSET_PRICE_PERIOD.FIVE_YEARS:
                fromMoment = lastMoment.clone().subtract(5, "years")
                break
            default:
                throw new BadRequestException(`Timeframe non pris en charge : ${timeframe}`)
        }

        const prices: AssetPrice[] = await this.prisma.$queryRaw`
            SELECT *
            FROM "AssetPrice"
            WHERE "assetId" = ${asset.id}
            AND "timeframe" = CAST(${timeframe} AS text)
            AND "recordedAt" >= ${fromMoment.startOf("day").toISOString()}
            AND "recordedAt" <= ${lastMoment.endOf("day").toISOString()}
            ORDER BY "recordedAt" ASC
`

        return prices.map((p) => ({
            recordedAt: p.recordedAt,
            closingPrice: p.close,
        }))
    }
}
