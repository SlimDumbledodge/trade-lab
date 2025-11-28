import { Module } from "@nestjs/common"
import { PortfoliosService } from "./portfolios.service"
import { PortfoliosController } from "./portfolios.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"

@Module({
    controllers: [PortfoliosController],
    providers: [PortfoliosService],
    imports: [PrismaModule, PortfoliosAssetsModule],
    exports: [PortfoliosService],
})
export class PortfoliosModule {}
