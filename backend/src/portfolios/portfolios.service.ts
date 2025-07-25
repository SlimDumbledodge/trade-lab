import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BuyActifDto } from './dto/buy-actif.dto';

@Injectable()
export class PortfoliosService {
    constructor(private prisma: PrismaService) {}

    create(userId: number) {
        return this.prisma.portfolio.create({
            data: {
                user: {
                    connect: { id: userId },
                },
            },
            include: {
                user: true,
            },
        });
    }
    async buy(portfolioId: number, buyActifDto: BuyActifDto) {
        const { actifId, quantity } = buyActifDto;

        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } });

        if (!portfolio) {
            throw new NotFoundException(`Portfolio ID ${portfolioId} not found`);
        }

        const actif = await this.prisma.actif.findUnique({ where: { id: actifId } });
        if (!actif) {
            throw new NotFoundException(`Actif ID ${actifId} not found`);
        }

        const actifPrice = actif.price;
        const totalCost = quantity * actifPrice;

        if (portfolio.balance < totalCost) {
            throw new BadRequestException(
                `Insufficient funds: need ${totalCost}, available ${portfolio.balance}`,
            );
        }

        await this.prisma.portfolioActif.upsert({
            where: {
                portfolioId_actifId: {
                    portfolioId,
                    actifId,
                },
            },
            update: {
                quantity: { increment: quantity },
                averagePrice: actifPrice,
            },
            create: {
                portfolioId,
                actifId,
                quantity,
                averagePrice: totalCost,
            },
        });
