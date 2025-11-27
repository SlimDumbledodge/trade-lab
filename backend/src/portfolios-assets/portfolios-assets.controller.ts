import { Controller } from "@nestjs/common"
import { PortfoliosAssetsService } from "./portfolios-assets.service"

@Controller("portfolios-assets")
export class PortfoliosAssetsController {
    constructor(private readonly portfoliosAssetsService: PortfoliosAssetsService) {}
}
