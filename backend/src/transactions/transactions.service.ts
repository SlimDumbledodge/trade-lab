import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionPublic } from 'src/types/public.types';

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) {}

    async getTransactions(portfolioId: string, page: number = 1, limit: number = 10) {
        const nbTransactionsToSkip = (page - 1) * limit;

        const [items, total] = await this.prisma.$transaction([
            this.prisma.transaction.findMany({
                where: { portfolioId: portfolioId },
                include: { asset: true },
                orderBy: { createdAt: 'desc' },
                skip: nbTransactionsToSkip,
                take: limit,
            }),

            this.prisma.transaction.count({ where: { portfolioId } }),
        ]);

        return {
            data: {
                items,
                meta: {
                    total,
                    page,
                    lastPage: Math.ceil(total / limit),
                },
            },
        };
    }

    createTransaction(transaction: TransactionPublic) {
        return this.prisma.transaction.create({
            data: transaction,
        });
    }
}
