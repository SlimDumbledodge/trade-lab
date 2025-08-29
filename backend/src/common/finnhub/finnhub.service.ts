import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ActifPublic, CompanyPublic, MetricsPublic } from 'src/types/public.types';

@Injectable()
export class FinnhubService {
    private readonly token: string;
    private readonly baseUrl = 'https://finnhub.io/api/v1/';
    private readonly symbolEndpoint = this.baseUrl + 'search?q=';
    private readonly quoteEndpoint = this.baseUrl + 'quote?symbol=';
    private readonly companyProfileEndpoint = this.baseUrl + 'stock/profile2?symbol=';

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

            const { data: companyProfilInfo } = await firstValueFrom(
                this.httpService.get(`${this.companyProfileEndpoint}${symbol}${this.getTokenQueryString}`),
            );

            if (!companyProfilInfo) {
                throw new Error(`No company profil data found for ${symbol}`);
            }

            const symbolInfo = dataSymbol.result[0];

            return {
                description: symbolInfo.description ?? 'Description not available',
                logo: companyProfilInfo.logo,
                sectorActivity: companyProfilInfo.funnhubIndustry,
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

    async getCompanyProfile(symbol: string): Promise<CompanyPublic> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.companyProfileEndpoint}${symbol}${this.getTokenQueryString}`),
            );

            if (!data) throw new Error(`No profile found for ${symbol}`);

            return {
                ticker: data.ticker,
                name: data.name,
                logo: data.logo,
                country: data.country,
                currency: data.currency,
                exchange: data.exchange,
                industry: data.finnhubIndustry,
                marketEntryDate: data.ipo,
                marketCapitalization: data.marketCapitalization,
                sharesOutstanding: data.shareOutstanding,
                webUrl: data.weburl,
                phone: data.phone,
            };
        } catch (err) {
            throw new Error(`Failed to get company profile for ${symbol}: ${err.message}`);
        }
    }

    async getMetrics(symbol: string): Promise<MetricsPublic> {
        const { data } = await firstValueFrom(
            this.httpService.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all${this.getTokenQueryString}`),
        );

        if (!data?.metric) throw new Error(`No metrics found for ${symbol}`);

        return {
            tenDayAverageTradingVolume: data.metric['10DayAverageTradingVolume'],
            fiftyTwoWeekHigh: data.metric['52WeekHigh'],
            fiftyTwoWeekLow: data.metric['52WeekLow'],
            fiftyTwoWeekLowDate: new Date(data.metric['52WeekLowDate'] as string),
            fiftyTwoWeekPriceReturnDaily: data.metric['52WeekPriceReturnDaily'],
            beta: data.metric.beta,
        };
    }
}
