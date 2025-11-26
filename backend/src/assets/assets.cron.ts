import { Injectable } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AssetsCron {
    constructor(private assetsService: AssetsService) {}

    // @Cron(CronExpression.EVERY_30_SECONDS)
    // async updateAssetsPrices() {
    //     await this.assetsService.updateAllAssets();
    // }
}
