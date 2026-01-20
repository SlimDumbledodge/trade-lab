import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { Cron } from "@nestjs/schedule"
import { PortfoliosService } from "./portfolios.service"

@Injectable()
export class PortfoliosCron {
    private readonly logger = new Logger(PortfoliosCron.name)
    private readonly BATCH_SIZE = 100

    constructor(
        private readonly prisma: PrismaService,
        private readonly portfoliosService: PortfoliosService,
    ) {}

    @Cron("*/1 * * * *")
    async updateAllPortfoliosHoldingsValue() {
        this.logger.log("Début de la capture des holdingsValue pour chaque portefeuille...")
        const portfolios = await this.prisma.portfolio.findMany()

        for (let i = 0; i < portfolios.length; i += this.BATCH_SIZE) {
            const batch = portfolios.slice(i, i + this.BATCH_SIZE)
            const results = await Promise.allSettled(
                batch.map((portfolio) => this.portfoliosService.calculatePortfolioAssetsValue(portfolio.id)),
            )

            const successes = results.filter((result) => result.status === "fulfilled").length
            const failures = results.length - successes
            this.logger.log(`results`, results)
            this.logger.log(`Batch ${i / this.BATCH_SIZE + 1}: ${successes} OK, ${failures} erreurs`)
        }
        this.logger.log("Fin de la capture des holdingsValue pour chaque portefeuille...")
    }
}
