import { Module } from "@nestjs/common"
import { AlpacaService } from "./alpaca.service"
import { AlpacaController } from "./alpaca.controller"
import { PrismaModule } from "src/prisma/prisma.module"

@Module({
    controllers: [AlpacaController],
    providers: [AlpacaService],
    imports: [PrismaModule],
    exports: [AlpacaService]
})
export class AlpacaModule {}
