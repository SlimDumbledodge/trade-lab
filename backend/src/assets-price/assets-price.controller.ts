import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { AssetsPriceService } from "./assets-price.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { PrismaService } from "src/prisma/prisma.service"
import { ASSET_PRICE_PERIOD } from "./types/types"

@Controller("assets-price")
@UseGuards(JwtAuthGuard)
export class AssetsPriceController {
    constructor(
        private readonly assetsPriceService: AssetsPriceService,
        private readonly prisma: PrismaService,
    ) {}

    @Get(":symbol/:timeframe")
    async getAssetPrices(@Param("symbol") symbol: string, @Param("timeframe") timeframe: ASSET_PRICE_PERIOD) {
        return await this.assetsPriceService.getAssetPrices(symbol, timeframe)
    }
}
