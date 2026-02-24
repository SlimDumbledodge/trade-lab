import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common"
import { AlertsService } from "./alerts.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"
import { CreateAlertDto } from "./dto/create-alert.dto"
import { UpdateAlertDto } from "./dto/update-alert.dto"

@Controller("alerts")
@UseGuards(JwtAuthGuard)
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) {}

    @Post()
    create(@GetUser("id") userId: number, @Body() createAlertDto: CreateAlertDto) {
        return this.alertsService.create(userId, createAlertDto)
    }

    @Get()
    findAll(@GetUser("id") userId: number) {
        return this.alertsService.findAll(userId)
    }

    @Get(":id")
    findOne(@GetUser("id") userId: number, @Param("id", ParseIntPipe) alertId: number) {
        return this.alertsService.findOne(userId, alertId)
    }

    @Patch(":id")
    update(@GetUser("id") userId: number, @Param("id", ParseIntPipe) alertId: number, @Body() updateAlertDto: UpdateAlertDto) {
        return this.alertsService.update(userId, alertId, updateAlertDto)
    }

    @Delete(":id")
    remove(@GetUser("id") userId: number, @Param("id", ParseIntPipe) alertId: number) {
        return this.alertsService.remove(userId, alertId)
    }
}
