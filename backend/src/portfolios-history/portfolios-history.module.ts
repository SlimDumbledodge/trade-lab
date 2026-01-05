import { Module } from "@nestjs/common"
import { PortfoliosHistoryService } from "./portfolios-history.service"
import { PortfoliosHistoryController } from "./portfolios-history.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"

@Module({
    controllers: [PortfoliosHistoryController],
    providers: [PortfoliosHistoryService],
    imports: [PrismaModule, PortfoliosAssetsModule],
    exports: [PortfoliosHistoryService],
})
export class PortfoliosHistoryModule {}
