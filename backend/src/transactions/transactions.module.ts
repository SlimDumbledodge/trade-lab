import { Module } from "@nestjs/common"
import { TransactionsService } from "./transactions.service"
import { TransactionsController } from "./transactions.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PortfoliosModule } from "src/portfolios/portfolios.module"
import { PortfoliosAssetsModule } from "src/portfolios-assets/portfolios-assets.module"

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [PrismaModule, PortfoliosModule, PortfoliosAssetsModule],
    exports: [TransactionsService],
})
export class TransactionsModule {}
