import { Injectable, Logger } from "@nestjs/common"
import { NotificationType } from "prisma/generated/enums"
import { PrismaService } from "src/prisma/prisma.service"

interface CreateNotificationParams {
    userId: number
    alertId?: number
    type: NotificationType
    title: string
    message: string
    data?: object
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name)

    constructor(private readonly prisma: PrismaService) {}

    async findAll(userId: number) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                alert: {
                    select: {
                        id: true,
                        type: true,
                        status: true,
                        config: true,
                    },
                },
            },
        })
    }

    async markAsRead(userId: number, notificationId: number) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { readAt: new Date() },
        })
    }

    async markAllAsRead(userId: number) {
        return this.prisma.notification.updateMany({
            where: { userId, readAt: null },
            data: { readAt: new Date() },
        })
    }

    async create(params: CreateNotificationParams) {
        const notification = await this.prisma.notification.create({
            data: {
                userId: params.userId,
                alertId: params.alertId,
                type: params.type,
                title: params.title,
                message: params.message,
                data: params.data ?? undefined,
            },
        })

        this.logger.log(`Notification #${notification.id} créée pour l'utilisateur ${params.userId} : ${params.title}`)

        return notification
    }
}
