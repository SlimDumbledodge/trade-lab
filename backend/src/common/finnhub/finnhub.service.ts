import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Actif } from '@prisma/client';

type ActifPublic = Omit<Actif, 'id' | 'createdAt' | 'updatedAt' | 'portfolios'>;

@Injectable()
export class FinnhubService {
    private readonly token: string;
    private readonly baseUrl = 'https://finnhub.io/api/v1/';
    private readonly symbolEndpoint = this.baseUrl + 'search?q=';
    private readonly quoteEndpoint = this.baseUrl + 'quote?symbol=';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.token = this.configService.get<string>('FINNHUB_API_KEY') ?? '';
    }

    private get getTokenQueryString(): string {
        return `&token=${this.token}`;
    }

    async getActifInfo(symbol: string): Promise<ActifPublic> {
        try {
            const { data: dataSymbol } = await firstValueFrom(
                this.httpService.get(`${this.symbolEndpoint}${symbol}${this.getTokenQueryString}`),
            );

            if (!dataSymbol?.result?.length) {
                throw new Error(`No symbol data found for ${symbol}`);
            }

            const { data: quoteInfo } = await firstValueFrom(
                this.httpService.get(`${this.quoteEndpoint}${symbol}${this.getTokenQueryString}`),
            );

            if (!quoteInfo) {
                throw new Error(`No quote data found for ${symbol}`);
            }

            const symbolInfo = dataSymbol.result[0];

            return {
                description: symbolInfo.description ?? 'Description not available',
                symbol: symbolInfo.symbol,
                type: symbolInfo.type ?? 'Unknown',
                current_price: quoteInfo.c,
                highest_price_day: quoteInfo.h,
                lowest_price_day: quoteInfo.l,
                opening_price_day: quoteInfo.o,
                previous_close_price_day: quoteInfo.pc,
                percent_change: quoteInfo.dp,
                change: quoteInfo.d,
            };
        } catch (error) {
            console.error(`Failed to get actif info for ${symbol}:`, error);
            throw new Error(`Failed to get actif info for ${symbol}: ${error.message}`);
        }
    }
}
