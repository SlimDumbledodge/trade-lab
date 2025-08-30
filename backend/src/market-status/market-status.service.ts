import { Injectable } from '@nestjs/common';
import { FinnhubService } from 'src/common/finnhub/finnhub.service';

@Injectable()
export class MarketStatusService {
    constructor(private readonly finnhubService: FinnhubService) {}

    async getMarketStatus(): Promise<boolean> {
        return this.finnhubService.getMarketStatus();
    }
}
