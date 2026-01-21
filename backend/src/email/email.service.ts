import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "src/prisma/prisma.service"
import * as nodemailer from "nodemailer"
import * as crypto from "crypto"

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name)
    private nodemailerTransport: nodemailer.Transporter

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        // Configuration du transporteur nodemailer
        this.nodemailerTransport = nodemailer.createTransport({
            host: this.configService.get("EMAIL_HOST"),
            port: this.configService.get("EMAIL_PORT"),
            secure: false, // true pour 465, false pour d'autres ports
            auth: {
                user: this.configService.get("EMAIL_USER"),
                pass: this.configService.get("EMAIL_PASSWORD"),
            },
        })
    }

    public async sendResetPasswordLink(email: string): Promise<void> {
        // Génération d'un token sécurisé
        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        // Sauvegarde du token dans la base de données
        await this.prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken,
                resetPasswordExpires,
            },
        })

        // URL de réinitialisation avec le token non hashé
        const resetUrl = `${this.configService.get("FRONTEND_URL")}/reset-password?token=${resetToken}`

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .button { 
                        background-color: #4CAF50; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px;
                        display: inline-block;
                        margin: 20px 0;
                    }
                    .footer { margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Réinitialisation de votre mot de passe</h2>
                    <p>Bonjour,</p>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                    <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
                    <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
                    <p>Ou copiez ce lien dans votre navigateur :</p>
                    <p>${resetUrl}</p>
                    <p><strong>Ce lien expire dans 15 minutes.</strong></p>
                    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
                    <div class="footer">
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                    </div>
                </div>
            </body>
            </html>
        `

        const textContent = `
Réinitialisation de votre mot de passe

Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur ce lien pour réinitialiser votre mot de passe :
${resetUrl}

Ce lien expire dans 15 minutes.

Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
        `

        return this.sendMail({
            to: email,
            subject: "Réinitialisation de votre mot de passe - TradeLab",
            text: textContent,
            html: htmlContent,
        })
    }

    private async sendMail(options: nodemailer.SendMailOptions): Promise<void> {
        try {
            const info = await this.nodemailerTransport.sendMail(options)
            this.logger.log(`Email sent to ${options.to}: ${info.messageId}`)
        } catch (error) {
            this.logger.error(`Failed to send email to ${options.to}:`, error)
            throw error
        }
    }
}
