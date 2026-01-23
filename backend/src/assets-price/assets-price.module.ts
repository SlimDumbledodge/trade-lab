import { Module } from "@nestjs/common"
import { AssetsPriceService } from "./assets-price.service"
import { AssetsPriceController } from "./assets-price.controller"
import { AlpacaModule } from "src/alpaca/alpaca.module"
import { PrismaModule } from "src/prisma/prisma.module"
import { AssetsPriceCron } from "./assets-price.cron"
import { MarketStatusModule } from "src/market-status/market-status.module"

@Module({
    controllers: [AssetsPriceController],
    providers: [AssetsPriceService, AssetsPriceCron],
    imports: [PrismaModule, AlpacaModule, MarketStatusModule],
})
export class AssetsPriceModule {}
