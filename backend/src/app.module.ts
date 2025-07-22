import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ActifsModule } from './actifs/actifs.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        AuthModule,
        ActifsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ActifsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
