import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common"
import { AlertStatus } from "prisma/generated/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateAlertDto } from "./dto/create-alert.dto"
import { UpdateAlertDto } from "./dto/update-alert.dto"

const MAX_ACTIVE_ALERTS = 20

@Injectable()
export class AlertsService {
    private readonly logger = new Logger(AlertsService.name)

    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, dto: CreateAlertDto) {
        switch (dto.type) {
            case "PRICE":
                return this.createPriceAlert(userId, dto)
            default:
                throw new BadRequestException(`Type d'alerte non supporté : ${dto.type}`)
        }
    }

    private async createPriceAlert(userId: number, dto: CreateAlertDto) {
        const config = dto.config as { symbol: string }
        const asset = await this.prisma.asset.findUnique({ where: { symbol: config.symbol } })
        if (!asset) {
            throw new BadRequestException(`L'asset avec le symbole "${config.symbol}" n'existe pas`)
        }

        const activeCount = await this.prisma.alert.count({
            where: { userId, status: AlertStatus.ACTIVE },
        })
        if (activeCount >= MAX_ACTIVE_ALERTS) {
            throw new BadRequestException(`Vous avez atteint la limite de ${MAX_ACTIVE_ALERTS} alertes actives`)
        }

        const alert = await this.prisma.alert.create({
            data: {
                userId,
                type: dto.type,
                config: dto.config as object,
            },
        })

        this.logger.log(`Alerte ${alert.id} créée pour l'utilisateur ${userId} (type: ${dto.type})`)
        return alert
    }

    async findAll(userId: number) {
        return this.prisma.alert.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
    }

    async findOne(userId: number, alertId: number) {
        const alert = await this.prisma.alert.findUnique({ where: { id: alertId } })
        if (!alert) throw new NotFoundException(`Alerte #${alertId} introuvable`)
        if (alert.userId !== userId) throw new ForbiddenException("Vous n'avez pas accès à cette alerte")
        return alert
    }

    async update(userId: number, alertId: number, dto: UpdateAlertDto) {
        const alert = await this.findOne(userId, alertId)

        if (alert.status === AlertStatus.TRIGGERED) {
            throw new BadRequestException("Une alerte déjà déclenchée ne peut pas être modifiée")
        }

        // Si on réactive une alerte désactivée, vérifier la limite
        if (dto.status === "ACTIVE" && alert.status === AlertStatus.DISABLED) {
            const activeCount = await this.prisma.alert.count({
                where: { userId, status: AlertStatus.ACTIVE },
            })
            if (activeCount >= MAX_ACTIVE_ALERTS) {
                throw new BadRequestException(`Vous avez atteint la limite de ${MAX_ACTIVE_ALERTS} alertes actives`)
            }
        }

        // Merge config si fourni
        let updatedConfig: object | undefined
        if (dto.config) {
            const currentConfig = alert.config as Record<string, unknown>
            const merged = { ...currentConfig, ...dto.config }

            // Si le symbole change, vérifier que le nouvel asset existe
            if (dto.config.symbol && dto.config.symbol !== currentConfig.symbol) {
                const asset = await this.prisma.asset.findUnique({ where: { symbol: dto.config.symbol } })
                if (!asset) {
                    throw new BadRequestException(`L'asset avec le symbole "${dto.config.symbol}" n'existe pas`)
                }
            }

            updatedConfig = merged
        }

        return this.prisma.alert.update({
            where: { id: alertId },
            data: {
                ...(dto.status && { status: dto.status }),
                ...(updatedConfig && { config: updatedConfig }),
            },
        })
    }

    async remove(userId: number, alertId: number) {
        await this.findOne(userId, alertId)
        return this.prisma.alert.delete({ where: { id: alertId } })
    }
}
