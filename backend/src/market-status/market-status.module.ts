import { Module } from '@nestjs/common';
import { MarketStatusService } from './market-status.service';
import { MarketStatusController } from './market-status.controller';
import { FinnhubModule } from 'src/common/finnhub/finnhub.module';

@Module({
    controllers: [MarketStatusController],
    providers: [MarketStatusService],
    imports: [FinnhubModule],
})
export class MarketStatusModule {}
