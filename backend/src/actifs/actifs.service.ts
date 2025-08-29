import { Injectable } from '@nestjs/common';
import { FinnhubService } from 'src/common/finnhub/finnhub.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActifPublic, MetricsPublic } from 'src/types/public.types';

@Injectable()
export class ActifsService {
    constructor(
        private prisma: PrismaService,
        private finnhub: FinnhubService,
    ) {}

    findAll() {
        return this.prisma.actif.findMany();
    }

    async fetchActifData(symbol: string): Promise<{ dataActif: ActifPublic; dataMetrics: MetricsPublic }> {
        const dataActif = await this.finnhub.getActifInfo(symbol);
        const dataMetrics = await this.finnhub.getMetrics(symbol);
        return { dataActif, dataMetrics };
    }

    async syncActif(actifId: number, dataActif: ActifPublic, dataMetrics: MetricsPublic) {
        if (dataActif) {
            await this.prisma.actif.update({
                where: { symbol: dataActif.symbol },
                data: dataActif,
            });
        }

        if (dataMetrics) {
            await this.prisma.metrics.upsert({
                where: { actifId: actifId },
                update: {
                    tenDayAverageTradingVolume: dataMetrics.tenDayAverageTradingVolume,
                    fiftyTwoWeekHigh: dataMetrics.fiftyTwoWeekHigh,
                    fiftyTwoWeekLow: dataMetrics.fiftyTwoWeekLow,
                    fiftyTwoWeekLowDate: dataMetrics.fiftyTwoWeekLowDate,
                    fiftyTwoWeekPriceReturnDaily: dataMetrics.fiftyTwoWeekPriceReturnDaily,
                    beta: dataMetrics.beta,
                },
                create: {
                    actifId: actifId,
                    tenDayAverageTradingVolume: dataMetrics.tenDayAverageTradingVolume,
                    fiftyTwoWeekHigh: dataMetrics.fiftyTwoWeekHigh,
                    fiftyTwoWeekLow: dataMetrics.fiftyTwoWeekLow,
                    fiftyTwoWeekLowDate: dataMetrics.fiftyTwoWeekLowDate,
                    fiftyTwoWeekPriceReturnDaily: dataMetrics.fiftyTwoWeekPriceReturnDaily,
                    beta: dataMetrics.beta,
                },
            });
        }
    }

    async updateAllActifs() {
        const actifs = await this.findAll();

        for (const actif of actifs) {
            const { dataActif, dataMetrics } = await this.fetchActifData(actif.symbol);
            await this.syncActif(actif.id, dataActif, dataMetrics);
        }
    }

    async findActif(symbol: string) {
        const actif = await this.prisma.actif.findUnique({
            where: { symbol },
            include: { metrics: true },
        });

        if (!actif) {
            throw new Error(`No actif found for ${symbol}`);
        }

        return actif;
    }

    async getCompanyProfile(symbol: string) {
        const data = await this.finnhub.getCompanyProfile(symbol);

        if (!data) {
            throw new Error(`No company profile found for ${symbol}`);
        }

        return this.prisma.company.upsert({
            where: { ticker: symbol },
            create: {
                ...data,
                marketEntryDate: new Date(data.marketEntryDate),
            },
            update: {
                ...data,
                marketEntryDate: new Date(data.marketEntryDate),
            },
        });
    }
}
