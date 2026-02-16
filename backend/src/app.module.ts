import { Module } from "@nestjs/common"
import { SentryModule } from "@sentry/nestjs/setup"
import { PrismaModule } from "./prisma/prisma.module"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AssetsModule } from "./assets/assets.module"
import { PortfoliosModule } from "./portfolios/portfolios.module"
import { ScheduleModule } from "@nestjs/schedule"
import { TransactionsModule } from "./transactions/transactions.module"
import { PortfoliosAssetsModule } from "./portfolios-assets/portfolios-assets.module"
import { PortfoliosSnapshotsModule } from "./portfolios-snapshots/portfolios-snapshots.module"
import { AlpacaModule } from "./alpaca/alpaca.module"
import { AssetsPriceModule } from "./assets-price/assets-price.module"
import { FinnhubModule } from "./finnhub/finnhub.module"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { EmailModule } from "./email/email.module"
import { MarketStatusModule } from "./market-status/market-status.module"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"

@Module({
    imports: [
        SentryModule.forRoot(),
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
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), "uploads"),
            serveRoot: "/uploads",
            serveStaticOptions: {
                index: false,
            },
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
        PortfoliosAssetsModule,
        PortfoliosSnapshotsModule,
        AlpacaModule,
        AssetsPriceModule,
        FinnhubModule,
        EmailModule,
        MarketStatusModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
