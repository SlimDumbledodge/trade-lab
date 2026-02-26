import { Module } from "@nestjs/common"
import { PrismaModule } from "src/prisma/prisma.module"
import { InvestmentPlansService } from "./investment-plans.service"
import { InvestmentPlansController } from "./investment-plans.controller"
import { InvestmentPlansCron } from "./investment-plans.cron"
import { MarketStatusModule } from "src/market-status/market-status.module"
import { TransactionsModule } from "src/transactions/transactions.module"
import { NotificationsModule } from "src/notifications/notifications.module"

@Module({
    imports: [PrismaModule, MarketStatusModule, TransactionsModule, NotificationsModule],
    controllers: [InvestmentPlansController],
    providers: [InvestmentPlansService, InvestmentPlansCron],
})
export class InvestmentPlansModule {}
