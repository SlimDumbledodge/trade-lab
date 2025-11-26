import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AssetsCron } from './assets.cron';

@Module({
    controllers: [AssetsController],
    providers: [AssetsService, AssetsCron],
    imports: [PrismaModule],
})
export class AssetsModule {}
