import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { AlpacaService } from "src/alpaca/alpaca.service"
import { PrismaService } from "src/prisma/prisma.service"
import { ASSET_PRICE_PERIOD } from "./types/types"
import { AssetsPriceService } from "./assets-price.service"
import * as Sentry from "@sentry/nestjs"
import { MarketStatusService } from "src/market-status/market-status.service"
const moment = require("moment-timezone")
@Injectable()
export class AssetsPriceCron {
    private readonly logger = new Logger(AssetsPriceCron.name)
    constructor(
        private alpacaService: AlpacaService,
        private assetsPriceService: AssetsPriceService,
        private marketStatusService: MarketStatusService,
        private prisma: PrismaService,
    ) {}

    private async updateAssetsPrices(
        timeframe: ASSET_PRICE_PERIOD,
        substractAmount: moment.DurationInputArg1,
        unit: moment.DurationInputArg2,
    ): Promise<void> {
        try {
            const isMarketOpen = await this.marketStatusService.isMarketOpen()
            if (!isMarketOpen) {
                this.logger.log("❌ Marché fermé, updateByMinute ignoré")
                return
            }
            const assets = await this.prisma.asset.findMany()
            if (!assets) console.warn(`updateAssetsPriceByHour : Aucun assets trouver`)
            const symbols = assets.map((asset) => asset.symbol)

            this.logger.log(`✅ Mise à jour de ${symbols.length} assets sur ${timeframe}`)

            await this.alpacaService.getHistoricalBars({
                symbols,
                timeframe,
                start: moment().subtract(substractAmount, unit).format("YYYY-MM-DD"),
                end: moment().format("YYYY-MM-DD"),
            })

            await this.alpacaService.getLatestQuote({
                symbols,
            })
        } catch (error) {
            Sentry.captureException(error)
            this.logger.error("❌ Erreur dans updateByMinute", error)
        }
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async updateByMinute(): Promise<void> {
        try {
            const isMarketOpen = await this.marketStatusService.isMarketOpen()
            if (!isMarketOpen) {
                this.logger.log("❌ Marché fermé, updateByMinute ignoré")
                return
            }
            await this.updateAssetsPrices(ASSET_PRICE_PERIOD.ONE_DAY, 1, "day")
            await this.assetsPriceService.calculateTodayPerformance()
        } catch (error) {
            Sentry.captureException(error)
            this.logger.error("❌ Erreur dans updateByMinute", error)
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async updateByHour(): Promise<void> {
        try {
            await this.updateAssetsPrices(ASSET_PRICE_PERIOD.ONE_WEEK, 1, "week")
            await this.updateAssetsPrices(ASSET_PRICE_PERIOD.ONE_MONTH, 1, "month")
        } catch (error) {
            Sentry.captureException(error)
            this.logger.error("❌ Erreur dans updateByHour", error)
        }
    }
    @Cron(CronExpression.EVERY_DAY_AT_8PM)
    async updateByDay(): Promise<void> {
        try {
            await this.updateAssetsPrices(ASSET_PRICE_PERIOD.SIX_MONTHS, 6, "months")
            await this.updateAssetsPrices(ASSET_PRICE_PERIOD.ONE_YEAR, 1, "year")
            await this.updateAssetsPrices(ASSET_PRICE_PERIOD.FIVE_YEARS, 5, "years")
        } catch (error) {
            Sentry.captureException(error)
            this.logger.error("❌ Erreur dans updateByDay", error)
        }
    }
}
