import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { AssetsService } from "./assets.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"

@Controller("assets")
@UseGuards(JwtAuthGuard)
export class AssetsController {
    constructor(private readonly AssetsService: AssetsService) {}

    @Get()
    findAll() {
        return this.AssetsService.findAll()
    }

    @Get(":symbol")
    @UseGuards(JwtAuthGuard)
    async getAsset(@Param("symbol") symbol: string) {
        return this.AssetsService.findAsset(symbol)
    }
}
