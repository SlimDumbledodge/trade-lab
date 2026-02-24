import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from "@nestjs/common"
import { NotificationsService } from "./notifications.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    findAll(@GetUser("id") userId: number) {
        return this.notificationsService.findAll(userId)
    }

    @Patch(":id/read")
    markAsRead(@GetUser("id") userId: number, @Param("id", ParseIntPipe) notificationId: number) {
        return this.notificationsService.markAsRead(userId, notificationId)
    }

    @Patch("read-all")
    markAllAsRead(@GetUser("id") userId: number) {
        return this.notificationsService.markAllAsRead(userId)
    }
}
