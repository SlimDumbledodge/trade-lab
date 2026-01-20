import { Module } from "@nestjs/common"
import { PrismaModule } from "./prisma/prisma.module"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AssetsModule } from "./assets/assets.module"
import { PortfoliosModule } from "./portfolios/portfolios.module"
import { ScheduleModule } from "@nestjs/schedule"
import { TransactionsModule } from "./transactions/transactions.module"
import { PortfoliosAssetsModule } from "./portfolios-assets/portfolios-assets.module"
import { PortfoliosHistoryModule } from "./portfolios-snapshots/portfolios-snapshots.module"
import { AlpacaModule } from "./alpaca/alpaca.module"
import { AssetsPriceModule } from "./assets-price/assets-price.module"
import { FinnhubModule } from "./finnhub/finnhub.module"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"

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
            envFilePath: ".env",
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => [
                {
                    ttl: config.get<number>("THROTTLE_TTL") || 60000,
                    limit: config.get<number>("THROTTLE_LIMIT") || 100,
                },
            ],
        }),
        ScheduleModule.forRoot(),
        TransactionsModule,
        PortfoliosAssetsModule,
        PortfoliosHistoryModule,
        AlpacaModule,
        AssetsPriceModule,
        FinnhubModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
