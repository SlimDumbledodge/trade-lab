import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { BuyActifDto } from './dto/buy-actif.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('portfolios')
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}

    @Post(':id/buy')
    @UseGuards(JwtAuthGuard)
    buy(@Param('id', ParseIntPipe) portfolioId: number, @Body() buyActifDto: BuyActifDto) {
        return this.portfoliosService.buy(portfolioId, buyActifDto);
    }
}
