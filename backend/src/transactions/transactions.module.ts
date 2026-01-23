import { Module } from "@nestjs/common"
import { TransactionsService } from "./transactions.service"
import { TransactionsController } from "./transactions.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosModule } from "src/portfolios/portfolios.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"
import { PortfoliosSnapshotsModule } from "src/portfolios-snapshots/portfolios-snapshots.module"
import { MarketStatusModule } from "src/market-status/market-status.module"

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [PrismaModule, PortfoliosModule, PortfoliosAssetsModule, PortfoliosSnapshotsModule, MarketStatusModule],
    exports: [TransactionsService],
})
export class TransactionsModule {}
