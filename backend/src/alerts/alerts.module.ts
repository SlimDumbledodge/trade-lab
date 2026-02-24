import { Module } from "@nestjs/common"
import { AlertsService } from "./alerts.service"
import { AlertsController } from "./alerts.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { MarketStatusModule } from "src/market-status/market-status.module"
import { NotificationsModule } from "src/notifications/notifications.module"
import { AlertsWatcher } from "./alerts.watcher"

@Module({
    imports: [PrismaModule, MarketStatusModule, NotificationsModule],
    controllers: [AlertsController],
    providers: [AlertsService, AlertsWatcher],
    exports: [AlertsService],
})
export class AlertsModule {}
