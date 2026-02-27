import { Module } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { OrdersController } from "./orders.controller"
import { OrdersCron } from "./orders.cron"
import { PrismaModule } from "src/prisma/prisma.module"
import { MarketStatusModule } from "src/market-status/market-status.module"
import { TransactionsModule } from "src/transactions/transactions.module"
import { NotificationsModule } from "src/notifications/notifications.module"

@Module({
    imports: [PrismaModule, MarketStatusModule, TransactionsModule, NotificationsModule],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersCron],
})
export class OrdersModule {}
