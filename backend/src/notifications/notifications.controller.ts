import { Body, Controller, Get, Headers, Param, ParseIntPipe, Patch, Post, UnauthorizedException, UseGuards } from "@nestjs/common"
import { NotificationsService } from "./notifications.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"

@Controller("notifications")
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post("broadcast")
    broadcast(@Headers("x-admin-secret") secret: string, @Body() body: { title: string; message: string; data?: object }) {
        if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
            throw new UnauthorizedException("Secret admin invalide")
        }
        return this.notificationsService.broadcastToAll(body)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@GetUser("id") userId: number) {
        return this.notificationsService.findAll(userId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id/read")
    markAsRead(@GetUser("id") userId: number, @Param("id", ParseIntPipe) notificationId: number) {
        return this.notificationsService.markAsRead(userId, notificationId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch("read-all")
    markAllAsRead(@GetUser("id") userId: number) {
        return this.notificationsService.markAllAsRead(userId)
    }
}
