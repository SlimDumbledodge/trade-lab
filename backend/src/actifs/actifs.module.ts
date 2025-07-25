import { Module } from '@nestjs/common';
import { ActifsService } from './actifs.service';
import { ActifsController } from './actifs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [ActifsController],
    providers: [ActifsService],
    imports: [PrismaModule],
})
export class ActifsModule {}
