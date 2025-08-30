import { Controller, Get, UseGuards } from '@nestjs/common';
import { MarketStatusService } from './market-status.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('market-status')
export class MarketStatusController {
    constructor(private readonly marketStatusService: MarketStatusService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getMarketStatus() {
        return this.marketStatusService.getMarketStatus();
    }
}
