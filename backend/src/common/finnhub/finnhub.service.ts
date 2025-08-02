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
