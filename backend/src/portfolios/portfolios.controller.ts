import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransferActifDto } from './dto/transfer-actif-dto';

@Controller('portfolios')
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}

    @Get(':id/info')
    @UseGuards(JwtAuthGuard)
    info(@Param('id', ParseIntPipe) portfolioId: number) {
        return this.portfoliosService.getInfo(portfolioId);
    }

    @Post(':id/buy')
    @UseGuards(JwtAuthGuard)
    buy(@Param('id', ParseIntPipe) portfolioId: number, @Body() buyActifDto: TransferActifDto) {
        return this.portfoliosService.buy(portfolioId, buyActifDto);
    }

    @Post(':id/sell')
    @UseGuards(JwtAuthGuard)
    sell(@Param('id', ParseIntPipe) portfolioId: number, @Body() sellActifDto: TransferActifDto) {
        return this.portfoliosService.sell(portfolioId, sellActifDto);
    }
}
