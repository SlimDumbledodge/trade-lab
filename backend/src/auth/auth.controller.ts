import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ApiOkResponse, ApiTags, ApiOperation } from "@nestjs/swagger"
import { AuthEntity } from "./entities/auth.entity"
import { LoginDto } from "./dto/login.dto"
import { ForgotPasswordDto } from "./dto/forgot-password.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { Throttle } from "@nestjs/throttler"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Throttle({ default: { ttl: 900000, limit: 20 } })
    @Post("login")
    @ApiOkResponse({ type: AuthEntity })
    @ApiOperation({ summary: "Connexion utilisateur" })
    login(@Body() { email, password }: LoginDto) {
        return this.authService.login(email, password)
    }

    @Throttle({ default: { ttl: 900000, limit: 3 } })
    @Post("forgot-password")
    @ApiOperation({ summary: "Demande de réinitialisation du mot de passe" })
    @ApiOkResponse({
        description: "Email de réinitialisation envoyé si l'email existe",
        schema: {
            properties: {
                message: { type: "string" },
            },
        },
    })
    async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<{ message: string }> {
        return this.authService.forgotPassword(email)
    }

    @Throttle({ default: { ttl: 900000, limit: 80 } })
    @Post("reset-password")
    @ApiOperation({ summary: "Réinitialisation du mot de passe avec token" })
    @ApiOkResponse({
        description: "Mot de passe réinitialisé avec succès",
        schema: {
            properties: {
                message: { type: "string" },
            },
        },
    })
    async resetPassword(@Body() { token, newPassword }: ResetPasswordDto): Promise<{ message: string }> {
        return this.authService.resetPassword(token, newPassword)
    }
}
