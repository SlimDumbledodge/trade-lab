import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferActifDto } from './dto/transfer-actif-dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class PortfoliosService {
    constructor(
        private prisma: PrismaService,
        private transactionsService: TransactionsService,
    ) {}

    create(userId: number) {
        return this.prisma.portfolio.create({
            data: { user: { connect: { id: userId } } },
            include: { user: true },
        });
    }

    async getInfo(portfolioId: number) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: { actifs: { include: { actif: true } } },
        });

        if (!portfolio) throw new NotFoundException(`Portfolio ID ${portfolioId} not found`);

        const totalValueActifs = portfolio.actifs.reduce((sum, ptfActif) => {
            const currentPrice = ptfActif.actif.current_price;
            return sum + ptfActif.quantity * currentPrice;
        }, 0);
        return {
            balance: portfolio.balance,
            totalActifsValue: totalValueActifs,
            totalPortfolioValue: portfolio.balance + totalValueActifs,
            portfolio,
        };
    }

    async buy(portfolioId: number, buyActifDto: TransferActifDto) {
        const { actifId, quantity } = buyActifDto;

        const [portfolio, actif] = await Promise.all([
            this.prisma.portfolio.findUnique({ where: { id: portfolioId } }),
            this.prisma.actif.findUnique({ where: { id: actifId } }),
        ]);
        if (!portfolio) throw new NotFoundException(`Portfolio ID ${portfolioId} not found`);
        if (!actif) throw new NotFoundException(`Actif ID ${actifId} not found`);

        const actifPrice = actif.current_price;
        const totalCost = quantity * actifPrice;

        if (portfolio.balance < totalCost) {
            throw new BadRequestException(`Insufficient funds: need ${totalCost}, available ${portfolio.balance}`);
        }

        await this.prisma.portfolioActif.upsert({
            where: { portfolioId_actifId: { portfolioId, actifId } },
            update: { quantity: { increment: quantity }, averagePrice: actifPrice },
            create: { portfolioId, actifId, quantity, averagePrice: totalCost },
        });

        await this.prisma.portfolio.update({
            where: { id: portfolioId },
            data: { balance: { decrement: totalCost } },
        });

        await this.transactionsService.createTransaction({
            type: TransactionType.BUY,
            quantity,
            priceAtExecution: actifPrice,
            actifId,
            portfolioId,
        });
        });

        return {
            actifId,
            quantity,
            unitPrice: actifPrice,
            totalCost,
            newBalance: portfolio.balance - totalCost,
        };
    }

    async sell(portfolioId: number, sellActifDto: TransferActifDto) {
        const { actifId, quantity } = sellActifDto;

        const [portfolio, actif] = await Promise.all([
            this.prisma.portfolio.findUnique({
                where: { id: portfolioId },
                include: { actifs: true },
            }),
            this.prisma.actif.findUnique({ where: { id: actifId } }),
        ]);

        if (!portfolio) throw new NotFoundException(`Portfolio ID ${portfolioId} not found`);
        if (!actif) throw new NotFoundException(`Actif ID ${actifId} not found`);

        const actifInPortfolio = portfolio.actifs.find((act) => act.actifId === actifId);
        const totalValue = actif.current_price * quantity;

        if (!actifInPortfolio) throw new NotFoundException(`You can't sell an actif you do not own`);
        if (quantity > actifInPortfolio.quantity) throw new BadRequestException(`You can't sell more than you own`);

        await this.prisma.portfolio.update({
            where: { id: portfolioId },
            data: { balance: { increment: totalValue } },
        });

        if (quantity === actifInPortfolio.quantity) {
            await this.prisma.portfolioActif.delete({ where: { id: actifInPortfolio.id } });
        } else {
            await this.prisma.portfolioActif.update({
                where: { id: actifInPortfolio.id },
                data: { quantity: actifInPortfolio.quantity - quantity },
            });
        }
    }
}
