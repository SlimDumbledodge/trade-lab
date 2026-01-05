import { Module } from "@nestjs/common"
import { AlpacaService } from "./alpaca.service"
import { AlpacaController } from "./alpaca.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { ConfigModule } from "@nestjs/config"

@Module({
    controllers: [AlpacaController],
    providers: [AlpacaService],
    imports: [PrismaModule, ConfigModule],
    exports: [AlpacaService],
})
export class AlpacaModule {}
