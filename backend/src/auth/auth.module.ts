import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { UsersModule } from "src/users/users.module"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { EmailModule } from "src/email/email.module"

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get<string>("JWT_SECRET"),
                    signOptions: { expiresIn: "1h" },
                }
            },
        }),
        UsersModule,
        EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
