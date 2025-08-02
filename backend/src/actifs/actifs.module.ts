import { Module } from '@nestjs/common';
import { ActifsService } from './actifs.service';
import { ActifsController } from './actifs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FinnhubModule } from 'src/common/finnhub/finnhub.module';
import { ActifsCron } from './actifs.cron';

@Module({
    controllers: [ActifsController],
    providers: [ActifsService, ActifsCron],
    imports: [PrismaModule, FinnhubModule],
})
export class ActifsModule {}
