import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { PortfoliosService } from "./portfolios.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "src/portfolios-snapshots/types/types"

@Controller("portfolio")
@UseGuards(JwtAuthGuard)
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}

    @Get(":period")
    getPortfolio(@GetUser("portfolioId") portfolioId: number, @Param("period") period: PORTFOLIO_PERFORMANCE_PERIOD) {
        return this.portfoliosService.getPortfolio(portfolioId, period)
    }
}
