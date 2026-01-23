import { Module } from "@nestjs/common"
import { PortfoliosSnapshotsService } from "./portfolios-snapshots.service"
import { PortfoliosSnapshotsController } from "./portfolios-snapshots.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"
import { PortfoliosSnapshotsCron } from "./portfolios-snapshots.cron"
import { MarketStatusModule } from "src/market-status/market-status.module"

@Module({
    controllers: [PortfoliosSnapshotsController],
    providers: [PortfoliosSnapshotsService, PortfoliosSnapshotsCron],
    imports: [PrismaModule, PortfoliosAssetsModule, MarketStatusModule],
    exports: [PortfoliosSnapshotsService],
})
export class PortfoliosSnapshotsModule {}
