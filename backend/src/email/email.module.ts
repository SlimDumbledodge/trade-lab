import { Module } from "@nestjs/common"
import { EmailService } from "./email.service"
import { EmailController } from "./email.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: "15m" },
            }),
        }),
    ],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
