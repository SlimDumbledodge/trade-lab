import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ActifsModule } from './actifs/actifs.module';
import { PortfoliosModule } from './portfolios/portfolios.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        AuthModule,
        ActifsModule,
        PortfoliosModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ActifsModule,
        PortfoliosModule,
    ],
})
export class AppModule {}
