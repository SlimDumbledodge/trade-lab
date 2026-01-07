import { Controller } from "@nestjs/common"
import { PortfoliosSnapshotsService } from "./portfolios-snapshots.service"

@Controller("portfolios-history")
export class PortfoliosHistoryController {
    constructor(private readonly portfoliosHistoryService: PortfoliosSnapshotsService) {}
}
