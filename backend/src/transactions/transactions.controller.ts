import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get('portfolios/:id/transactions')
    @UseGuards(JwtAuthGuard)
    getTransactions(
        @Param('id', ParseIntPipe) portfolioId: number,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        return this.transactionsService.getTransactions(portfolioId, Number(page), Number(limit));
    }
}
