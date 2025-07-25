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
