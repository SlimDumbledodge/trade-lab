import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.asset.findMany();
    }

    async findAsset(symbol: string) {
        const asset = await this.prisma.asset.findUnique({
            where: { symbol },
        });

        if (!asset) {
            throw new Error(`No asset found for ${symbol}`);
        }

        return asset;
    }
}
