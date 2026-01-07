import { Module } from "@nestjs/common"
import { AssetsService } from "./assets.service"
import { AssetsController } from "./assets.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { FinnhubModule } from "src/finnhub/finnhub.module"
import { AssetCron } from "./asset.cron"

@Module({
    controllers: [AssetsController],
    providers: [AssetsService, AssetCron],
    imports: [PrismaModule, FinnhubModule],
})
export class AssetsModule {}
