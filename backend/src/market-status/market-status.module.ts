import { Module } from "@nestjs/common"
import { MarketStatusService } from "./market-status.service"
import { MarketStatusController } from "./market-status.controller"
import { PrismaModule } from "src/prisma/prisma.module"

@Module({
    controllers: [MarketStatusController],
    providers: [MarketStatusService],
    imports: [PrismaModule],
    exports: [MarketStatusService],
})
export class MarketStatusModule {}
