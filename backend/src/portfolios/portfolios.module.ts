import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [PortfoliosController],
    providers: [PortfoliosService],
    imports: [PrismaModule],
})
export class PortfoliosModule {}
