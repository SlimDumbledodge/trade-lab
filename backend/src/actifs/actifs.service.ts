import { Injectable } from '@nestjs/common';
import { FinnhubService } from 'src/common/finnhub/finnhub.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActifsService {
    constructor(
        private prisma: PrismaService,
        private finnhub: FinnhubService,
    ) {}

    findAll() {
        return this.prisma.actif.findMany();
    }
    async getActif() {
        const actifs = await this.findAll();
        for (const actif of actifs) {
            const data = await this.finnhub.getActifInfo(actif.symbol);
            if (data) {
                await this.prisma.actif.update({
                    where: {
                        symbol: data.symbol,
                    },
                    data: data,
                });
            }
        }
    }
}
