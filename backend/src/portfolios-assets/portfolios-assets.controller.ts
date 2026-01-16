import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { PortfoliosAssetsService } from "./portfolios-assets.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"

@Controller("portfolios-assets")
@UseGuards(JwtAuthGuard)
export class PortfoliosAssetsController {
    constructor(private readonly portfoliosAssetsService: PortfoliosAssetsService) {}

    @Get(":symbol")
    getPortfolioAsset(@Param("symbol") symbol: string, @GetUser("portfolioId") portfolioId: number) {
        return this.portfoliosAssetsService.getPortfolioAsset(symbol, portfolioId)
    }
}
