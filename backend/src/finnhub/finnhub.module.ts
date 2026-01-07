import { Module } from "@nestjs/common"
import { FinnhubService } from "./finnhub.service"
import { FinnhubController } from "./finnhub.controller"
import { PrismaModule } from "src/prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    controllers: [FinnhubController],
    providers: [FinnhubService],
    exports: [FinnhubService],
})
export class FinnhubModule {}
