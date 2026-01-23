import { Controller, Get, UseGuards } from "@nestjs/common"
import { MarketStatusService } from "./market-status.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"

@Controller("market-status")
@UseGuards(JwtAuthGuard)
export class MarketStatusController {
    constructor(private readonly marketStatusService: MarketStatusService) {}

    @Get()
    async getMarketStatus() {
        return this.marketStatusService.getMarketStatus()
    }
}
