import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FinnhubService } from './finnhub.service';

@Module({
    imports: [HttpModule, ConfigModule],
    providers: [FinnhubService],
    exports: [FinnhubService],
})
export class FinnhubModule {}
