import { Module } from "@nestjs/common"
import { AssetsPriceService } from "./assets-price.service"
import { AssetsPriceController } from "./assets-price.controller"
import { AlpacaService } from "src/alpaca/alpaca.service"
import { AlpacaModule } from "src/alpaca/alpaca.module"
import { PrismaModule } from "src/prisma/prisma.module"
import { AssetsPriceCron } from "./assets-price.cron"

@Module({
    controllers: [AssetsPriceController],
    providers: [AssetsPriceService, AssetsPriceCron],
    imports: [PrismaModule, AlpacaModule],
})
export class AssetsPriceModule {}
