import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
    controllers: [PortfoliosController],
    providers: [PortfoliosService],
    imports: [PrismaModule, TransactionsModule],
})
export class PortfoliosModule {}
