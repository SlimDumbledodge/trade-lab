import { Injectable } from '@nestjs/common';
import { ActifsService } from './actifs.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ActifsCron {
    constructor(private actifsService: ActifsService) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async updateActifsPrices() {
        await this.actifsService.updateAllActifs();
    }
}
