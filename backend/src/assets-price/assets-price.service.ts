import { BadRequestException, Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { ASSET_PRICE_PERIOD } from "./types/types"
import { AssetPrice } from "prisma/generated/client"
import { AlpacaService } from "src/alpaca/alpaca.service"
const moment = require("moment-timezone")

@Injectable()
export class AssetsPriceService {
    private readonly logger = new Logger(AssetsPriceService.name)
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

    async calculateTodayPerformance() {
        const assets = await this.prisma.asset.findMany()
        if (!assets.length) {
            this.logger.warn("calculateTodayPerformance : Aucun assets trouvé")
            return
        }

        // Récupérer le dernier jour d'ouverture du marché
        const lastDayOpened = await this.alpacaService.getLastDayOpeningMarket()
        if (!lastDayOpened) {
            this.logger.error("Impossible de déterminer le dernier jour d'ouverture du marché")
            return
        }

        // Calculer la date de la veille (jour de bourse précédent)
        const previousDay = moment(lastDayOpened).subtract(1, "day")

        for (const asset of assets) {
            try {
                // Récupérer le dernier point de clôture de la veille
                const previousClose = await this.prisma.assetPrice.findFirst({
                    where: {
                        assetId: asset.id,
                        timeframe: ASSET_PRICE_PERIOD.ONE_DAY,
                        recordedAt: {
                            gte: previousDay.clone().startOf("day").toDate(),
                            lte: previousDay.clone().endOf("day").toDate(),
                        },
                    },
                    orderBy: { recordedAt: "desc" },
                })

                if (!previousClose) {
                    this.logger.warn(`Pas de prix de clôture trouvé pour ${asset.symbol} le ${previousDay.format("YYYY-MM-DD")}`)
                    continue
                }

                if (!asset.lastPrice || asset.lastPrice.toNumber() === 0) {
                    this.logger.warn(`Pas de lastPrice valide pour ${asset.symbol}`)
                    continue
                }

                // Calculer la performance : ((Prix actuel - Prix clôture veille) / Prix clôture veille) × 100
                const performance = ((asset.lastPrice.toNumber() - previousClose.close.toNumber()) / previousClose.close.toNumber()) * 100

                // Mettre à jour l'asset avec la performance du jour
                await this.prisma.asset.update({
                    where: { id: asset.id },
                    data: { todayPerformance: performance },
                })

                this.logger.log(`✅ ${asset.symbol}: ${performance.toFixed(2)}% (${asset.lastPrice} vs ${previousClose.close})`)
            } catch (error) {
                this.logger.error(`Erreur lors du calcul de performance pour ${asset.symbol}:`, error.message)
            }
        }
    }
}
