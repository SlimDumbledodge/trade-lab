import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common"
import { OrderExpiresType, OrderStatus } from "prisma/generated/enums"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateOrderDto } from "./dto/create-order.dto"

const MAX_ACTIVE_ORDERS = 20

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name)

    constructor(private readonly prisma: PrismaService) {}

    async findAllActive(portfolioId: number) {
        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } })
        if (!portfolio) {
            throw new NotFoundException("Portfolio introuvable")
        }

        return this.prisma.order.findMany({
            where: {
                userId: portfolio.userId,
                status: OrderStatus.ACTIVE,
            },
            include: { asset: true },
            orderBy: { createdAt: "desc" },
        })
    }

    async findActiveByAsset(portfolioId: number, assetId: number) {
        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } })
        if (!portfolio) {
            throw new NotFoundException("Portfolio introuvable")
        }

        return this.prisma.order.findMany({
            where: {
                userId: portfolio.userId,
                assetId,
                status: OrderStatus.ACTIVE,
            },
            orderBy: { createdAt: "desc" },
        })
    }

    async createOrder(portfolioId: number, dto: CreateOrderDto) {
        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } })
        if (!portfolio) {
            throw new NotFoundException("Portfolio introuvable")
        }

        const asset = await this.prisma.asset.findUnique({ where: { id: dto.assetId } })
        if (!asset) {
            throw new NotFoundException(`L'asset avec l'ID ${dto.assetId} n'existe pas`)
        }

        const activeCount = await this.prisma.order.count({
            where: { userId: portfolio.userId, status: OrderStatus.ACTIVE },
        })
        if (activeCount >= MAX_ACTIVE_ORDERS) {
            throw new BadRequestException(`Vous avez atteint la limite de ${MAX_ACTIVE_ORDERS} ordres actifs`)
        }

        const expiresAt = this.computeExpiresAt(dto.expiresType)

        const order = await this.prisma.order.create({
            data: {
                userId: portfolio.userId,
                assetId: dto.assetId,
                type: dto.type,
                action: dto.action,
                expiresType: dto.expiresType,
                quantity: dto.quantity,
                targetPrice: dto.targetPrice,
                expiresAt,
            },
        })

        this.logger.log(
            `Ordre #${order.id} créé pour l'utilisateur ${portfolio.userId} (${dto.action} ${dto.type} sur asset ${dto.assetId})`,
        )
        return order
    }

    async deleteOrder(portfolioId: number, orderId: number) {
        const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } })
        if (!portfolio) {
            throw new NotFoundException("Portfolio introuvable")
        }

        const order = await this.prisma.order.findUnique({ where: { id: orderId } })
        if (!order) {
            throw new NotFoundException(`L'ordre #${orderId} n'existe pas`)
        }

        if (order.userId !== portfolio.userId) {
            throw new ForbiddenException("Vous n'avez pas accès à cet ordre")
        }

        if (order.status !== OrderStatus.ACTIVE) {
            throw new BadRequestException("Seuls les ordres actifs peuvent être annulés")
        }

        const cancelled = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CANCELLED },
        })

        this.logger.log(`Ordre #${orderId} annulé par l'utilisateur ${portfolio.userId}`)
        return cancelled
    }

    private computeExpiresAt(expiresType: OrderExpiresType): Date {
        const now = new Date()
        switch (expiresType) {
            case OrderExpiresType.DAY:
                return new Date(now.getTime() + 24 * 60 * 60 * 1000)
            case OrderExpiresType.YEAR:
                return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds())
        }
    }
}
