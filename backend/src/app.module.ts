import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AssetsModule } from './assets/assets.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionsModule } from './transactions/transactions.module';
import { PortfoliosAssetsModule } from './portfolios-assets/portfolios-assets.module';
import { PortfoliosHistoryModule } from './portfolios-history/portfolios-history.module';
import { AlpacaModule } from './alpaca/alpaca.module';
import { AssetsPriceModule } from './assets-price/assets-price.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        AuthModule,
        AssetsModule,
        PortfoliosModule,
        TransactionsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        TransactionsModule,
        PortfoliosAssetsModule,
        PortfoliosHistoryModule,
        AlpacaModule,
        AssetsPriceModule,
    ],
})
export class AppModule {}
