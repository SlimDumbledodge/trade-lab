import { Module } from "@nestjs/common"
import { PortfoliosService } from "./portfolios.service"
import { PortfoliosController } from "./portfolios.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"
import { PortfoliosSnapshotsModule } from "src/portfolios-snapshots/portfolios-snapshots.module"
import { PortfoliosSnapshotsCron } from "src/portfolios-snapshots/portfolios-snapshots.cron"
import { PortfoliosCron } from "./portfolios.cron"
import { MarketStatusModule } from "src/market-status/market-status.module"

@Module({
    controllers: [PortfoliosController],
    providers: [PortfoliosService, PortfoliosSnapshotsCron, PortfoliosCron],
    imports: [PrismaModule, PortfoliosAssetsModule, PortfoliosSnapshotsModule, MarketStatusModule],
    exports: [PortfoliosService],
})
export class PortfoliosModule {}
