import { Module } from "@nestjs/common"
import { PortfoliosService } from "./portfolios.service"
import { PortfoliosController } from "./portfolios.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"
import { PortfoliosHistoryModule } from "src/portfolios-snapshots/portfolios-snapshots.module"
import { PortfoliosSnapshotsCron } from "src/portfolios-snapshots/portfolios-snapshots.cron"

@Module({
    controllers: [PortfoliosController],
    providers: [PortfoliosService, PortfoliosSnapshotsCron],
    imports: [PrismaModule, PortfoliosAssetsModule, PortfoliosHistoryModule],
    exports: [PortfoliosService],
})
export class PortfoliosModule {}
