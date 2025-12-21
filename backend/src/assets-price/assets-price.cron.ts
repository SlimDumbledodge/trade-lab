import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import * as moment from "moment"
import { AlpacaService } from "src/alpaca/alpaca.service"
import { TimeframeEnum } from "src/alpaca/types/alpaca.types"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class AssetsPriceCron {
    private readonly logger = new Logger(AssetsPriceCron.name)
    constructor(
        private alpacaService: AlpacaService,
        private prisma: PrismaService,
    ) {}

    private async updateAssetsPrices(
        timeframe: TimeframeEnum,
        substractAmount: moment.DurationInputArg1,
        unit: moment.DurationInputArg2,
    ): Promise<void> {
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
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async updateByMinute(): Promise<void> {
        await this.updateAssetsPrices(TimeframeEnum.ONE_MIN, 1, "day")
    }

    @Cron(CronExpression.EVERY_HOUR)
    async updateByHour(): Promise<void> {
        await this.updateAssetsPrices(TimeframeEnum.ONE_HOUR, 1, "week")
    }

    @Cron(CronExpression.EVERY_6_HOURS)
    async updateBy6Hours(): Promise<void> {
        await this.updateAssetsPrices(TimeframeEnum.SIX_HOUR, 1, "month")
    }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async updateByDay(): Promise<void> {
        await this.updateAssetsPrices(TimeframeEnum.ONE_DAY, 6, "months")
    }

    @Cron(CronExpression.EVERY_WEEK)
    async updateByWeek(): Promise<void> {
        await this.updateAssetsPrices(TimeframeEnum.ONE_WEEK, 1, "year")
    }

    @Cron(CronExpression.EVERY_WEEK)
    async updateByMonth(): Promise<void> {
        await this.updateAssetsPrices(TimeframeEnum.ONE_MONTH, 5, "years")
    }
}
