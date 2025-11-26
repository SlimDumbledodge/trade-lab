import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransferAssetDto } from './dto/transfer-asset-dto';

@Controller('portfolios')
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}

    @Get(':id/info')
    @UseGuards(JwtAuthGuard)
    info(@Param('id') portfolioId: string) {
        return this.portfoliosService.getInfo(portfolioId);
    }

    @Post(':id/buy')
    @UseGuards(JwtAuthGuard)
    buy(@Param('id') portfolioId: string, @Body() buyAssetDto: TransferAssetDto) {
        return this.portfoliosService.buy(portfolioId, buyAssetDto);
    }

    @Post(':id/sell')
    @UseGuards(JwtAuthGuard)
    sell(@Param('id') portfolioId: string, @Body() sellAssetDto: TransferAssetDto) {
        return this.portfoliosService.sell(portfolioId, sellAssetDto);
    }
}
