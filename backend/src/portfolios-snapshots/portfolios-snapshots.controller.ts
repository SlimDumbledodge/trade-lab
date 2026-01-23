import { Controller } from "@nestjs/common"
import { PortfoliosSnapshotsService } from "./portfolios-snapshots.service"

@Controller("portfolios-history")
export class PortfoliosSnapshotsController {
    constructor(private readonly portfoliosSnapshotsService: PortfoliosSnapshotsService) {}
}
