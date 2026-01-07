import { Module } from "@nestjs/common"
import { PortfoliosSnapshotsService } from "./portfolios-snapshots.service"
import { PortfoliosHistoryController } from "./portfolios-snapshots.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"
import { PortfoliosSnapshotsCron } from "./portfolios-snapshots.cron"

@Module({
    controllers: [PortfoliosHistoryController],
    providers: [PortfoliosSnapshotsService, PortfoliosSnapshotsCron],
    imports: [PrismaModule, PortfoliosAssetsModule],
    exports: [PortfoliosSnapshotsService],
})
export class PortfoliosHistoryModule {}
