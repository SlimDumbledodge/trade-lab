import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common"
import { EmailService } from "./email.service"
import { ContactDto } from "./dto/contact.dto"
import { SkipThrottle, Throttle } from "@nestjs/throttler"

@Controller("email")
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post("contact")
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 messages par heure
    async sendContactEmail(@Body() contactDto: ContactDto): Promise<{ message: string }> {
        await this.emailService.sendContactEmail(contactDto)
        return { message: "Message envoyé avec succès" }
    }
}
