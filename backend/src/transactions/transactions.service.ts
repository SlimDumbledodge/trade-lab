import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionPublic } from 'src/types/public.types';

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) {}

    getTransactions(portfolioId: number) {
        return this.prisma.transaction.findMany({
            where: {
                portfolioId: portfolioId,
            },
            include: {
                actif: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    createTransaction(transaction: TransactionPublic) {
        return this.prisma.transaction.create({
            data: transaction,
        });
    }
}
