import { Module } from "@nestjs/common"
import { PortfoliosAssetsService } from "./portfolios-assets.service"
import { PortfoliosAssetsController } from "./portfolios-assets.controller"
import { PrismaModule } from "src/prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    controllers: [PortfoliosAssetsController],
    providers: [PortfoliosAssetsService],
    exports: [PortfoliosAssetsService],
})
export class PortfoliosAssetsModule {}
