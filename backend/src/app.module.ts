import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ActifsModule } from './actifs/actifs.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionsModule } from './transactions/transactions.module';
import { MarketStatusModule } from './market-status/market-status.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        AuthModule,
        ActifsModule,
        PortfoliosModule,
        TransactionsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        TransactionsModule,
        MarketStatusModule,
    ],
})
export class AppModule {}
