import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ApiOkResponse } from "@nestjs/swagger"
import { AuthEntity } from "./entities/auth.entity"
import { LoginDto } from "./dto/login.dto"
import { Throttle } from "@nestjs/throttler"

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Throttle({ default: { ttl: 900000, limit: 5 } })
    @Post("login")
    @ApiOkResponse({ type: AuthEntity })
    login(@Body() { email, password }: LoginDto) {
        return this.authService.login(email, password)
    }
}
