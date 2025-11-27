import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { PortfoliosService } from "./portfolios.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"

@Controller("portfolio")
@UseGuards(JwtAuthGuard)
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}

    @Get()
    getPortfolio(@GetUser("portfolioId") portfolioId: number) {
        return this.portfoliosService.getPortfolio(portfolioId)
    }
}
