import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssetPublic } from 'src/types/public.types';

@Injectable()
export class AssetsService {
    constructor(
        private prisma: PrismaService,
    ) {}

    findAll() {
        return this.prisma.asset.findMany();
    }

    // async fetchActifData(symbol: string): Promise<{ dataActif: AssetPublic; dataMetrics: MetricsPublic }> {
    //     const dataActif = await this.finnhub.getActifInfo(symbol);
    //     const dataMetrics = await this.finnhub.getMetrics(symbol);
    //     return { dataActif, dataMetrics };
    // }

    // async syncActif(actifId: number, dataActif: AssetPublic, dataMetrics: MetricsPublic) {
    //     if (dataActif) {
    //         await this.prisma.asset.update({
    //             where: { symbol: dataActif.symbol },
    //             data: dataActif,
    //         });
    //     }

    // }

    // async updateAllAssets() {
    //     const assets = await this.findAll();

    //     for (const asset of assets) {
    //         const { dataActif, dataMetrics } = await this.fetchActifData(asset.symbol);
    //         await this.syncActif(asset.id, dataActif, dataMetrics);
    //     }
    // }

    async findAsset(symbol: string) {
        const asset = await this.prisma.asset.findUnique({
            where: { symbol },
        });

        if (!asset) {
            throw new Error(`No asset found for ${symbol}`);
        }

        return asset;
    }

    // async getCompanyProfile(symbol: string) {
    //     const data = await this.finnhub.getCompanyProfile(symbol);

    //     if (!data) {
    //         throw new Error(`No company profile found for ${symbol}`);
    //     }

    //     return data;
    // }
}
