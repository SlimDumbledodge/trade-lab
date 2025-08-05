import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get('portfolios/:id/transactions')
    @UseGuards(JwtAuthGuard)
    getTransactions(@Param('id', ParseIntPipe) portfolioId: number) {
        return this.transactionsService.getTransactions(portfolioId);
    }
}
