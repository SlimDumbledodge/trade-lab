import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { FinnhubService } from "src/finnhub/finnhub.service"

@Injectable()
export class AssetCron {
    private readonly logger = new Logger(AssetCron.name)

    constructor(private readonly finnhubService: FinnhubService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async updateCompanyProfil() {
        this.logger.log("updateCompanyProfil : Début ...")
        await this.finnhubService.updateCompanyProfil()
        this.logger.log("updateCompanyProfil: Fin ...")
    }
}
