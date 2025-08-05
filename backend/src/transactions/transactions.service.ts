import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type TransactionPublic = Pick<
    Transaction,
    'type' | 'quantity' | 'priceAtExecution' | 'actifId' | 'portfolioId'
>;

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) {}

    getTransactions(portfolioId: number) {
        return this.prisma.transaction.findMany({
            where: {
                portfolioId: portfolioId,
            },
        });
    }
