import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "src/prisma/prisma.service"
import { AuthEntity } from "./entities/auth.entity"
import { EmailService } from "src/email/email.service"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) {}

    async login(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({ where: { email: email }, include: { portfolio: true } })

        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`)
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password")
        }

        return {
            accessToken: this.jwtService.sign({ userId: user.id }),
            user: {
                ...user,
                portfolioId: user.portfolio?.id ?? null,
            },
        }
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        // Par sécurité, on renvoie toujours le même message même si l'utilisateur n'existe pas
        // pour éviter l'énumération des emails
        if (!user) {
            return { message: "Si cet email existe, un lien de réinitialisation a été envoyé." }
        }

        await this.emailService.sendResetPasswordLink(email)

        return { message: "Si cet email existe, un lien de réinitialisation a été envoyé." }
    }

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        // Hasher le token reçu pour le comparer avec celui en base de données
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        // Trouver l'utilisateur avec ce token et vérifier qu'il n'a pas expiré
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    gt: new Date(), // Token non expiré
                },
            },
        })

        if (!user) {
            throw new BadRequestException("Token invalide ou expiré")
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Mettre à jour le mot de passe et supprimer le token
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        })

        return { message: "Mot de passe réinitialisé avec succès" }
    }
}
