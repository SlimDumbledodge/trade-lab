import { Module } from "@nestjs/common"
import { PortfoliosAssetsService } from "./portfolios-assets.service"
import { PortfoliosAssetsController } from "./portfolios-assets.controller"
import { PortfoliosAssetsCron } from "./portfolios-assets.cron"
import { PrismaModule } from "src/prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    controllers: [PortfoliosAssetsController],
    providers: [PortfoliosAssetsService, PortfoliosAssetsCron],
    exports: [PortfoliosAssetsService],
})
export class PortfoliosAssetsModule {}
