import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { PortfoliosSnapshotsService } from "./portfolios-snapshots.service"
import { Cron } from "@nestjs/schedule"
import { MarketStatusService } from "src/market-status/market-status.service"

@Injectable()
export class PortfoliosSnapshotsCron {
    private readonly logger = new Logger(PortfoliosSnapshotsCron.name)
    private readonly BATCH_SIZE = 100

    constructor(
        private readonly prisma: PrismaService,
        private readonly portfoliosSnapshotsService: PortfoliosSnapshotsService,
        private marketStatusService: MarketStatusService,
    ) {}

    @Cron("*/1 * * * *")
    async captureAllPortfolios() {
        const isMarketOpen = await this.marketStatusService.isMarketOpen()
        if (!isMarketOpen) {
            this.logger.log("❌ Marché fermé, captureAllPortfolios ignoré")
            return
        }
        this.logger.log("Début de la capture des snapshots de portefeuilles...")
        const portfolios = await this.prisma.portfolio.findMany()

        for (let i = 0; i < portfolios.length; i += this.BATCH_SIZE) {
            const batch = portfolios.slice(i, i + this.BATCH_SIZE)
            const results = await Promise.allSettled(
                batch.map((portfolio) => this.portfoliosSnapshotsService.capturePortfolioSnapshot(portfolio.id)),
            )

            const successes = results.filter((result) => result.status === "fulfilled").length
            const failures = results.length - successes
            this.logger.log(`results`, results)
            this.logger.log(`Batch ${i / this.BATCH_SIZE + 1}: ${successes} OK, ${failures} erreurs`)
        }
        this.logger.log("Capture terminée.")
    }
}
