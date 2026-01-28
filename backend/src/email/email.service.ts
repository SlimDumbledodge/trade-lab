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
            secure: true, // true pour le port 465 (SSL/TLS direct)
            auth: {
                user: this.configService.get("EMAIL_USER"),
                pass: this.configService.get("EMAIL_PASSWORD"),
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 10000, // 10 secondes
            greetingTimeout: 10000, // 10 secondes
            socketTimeout: 10000, // 10 secondes
            logger: true, // Active les logs pour debug
            debug: true, // Active le mode debug
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
            from: `"TradeLab Studio" <${this.configService.get("EMAIL_USER")}>`,
            to: email,
            subject: "Réinitialisation de votre mot de passe - TradeLab Studio",
            text: textContent,
            html: htmlContent,
        })
    }

    public async sendContactEmail(contactData: {
        firstName: string
        lastName: string
        email: string
        subject: string
        message: string
    }): Promise<void> {
        const { firstName, lastName, email, subject, message } = contactData

        // Email envoyé à l'équipe TradeLab
        const htmlContentToTeam = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                    .header { background: linear-gradient(to right, #2563eb, #9333ea); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
                    .info-row { margin: 15px 0; padding: 10px; background-color: #f3f4f6; border-left: 4px solid #2563eb; }
                    .message-box { background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-top: 20px; }
                    .label { font-weight: bold; color: #2563eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2 style="margin: 0;">📧 Nouveau message de contact</h2>
                    </div>
                    <div class="content">
                        <p>Vous avez reçu un nouveau message depuis le formulaire de contact de TradeLab Studio.</p>
                        
                        <div class="info-row">
                            <span class="label">De :</span> ${firstName} ${lastName}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Email :</span> <a href="mailto:${email}">${email}</a>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Sujet :</span> ${subject}
                        </div>
                        
                        <div class="message-box">
                            <p class="label">Message :</p>
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #666;">
                            Pour répondre, utilisez directement l'adresse : <a href="mailto:${email}">${email}</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `

        const textContentToTeam = `
Nouveau message de contact - TradeLab Studio

De : ${firstName} ${lastName}
Email : ${email}
Sujet : ${subject}

Message :
${message}

---
Pour répondre, utilisez l'adresse : ${email}
        `

        // Email de confirmation envoyé à l'utilisateur
        const htmlContentToUser = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(to right, #2563eb, #9333ea); color: white; padding: 30px; border-radius: 8px; text-align: center; }
                    .content { padding: 30px 20px; }
                    .check-icon { font-size: 48px; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="check-icon">✓</div>
                        <h2 style="margin: 10px 0 0 0;">Message bien reçu !</h2>
                    </div>
                    <div class="content">
                        <p>Bonjour ${firstName},</p>
                        <p>Merci de nous avoir contactés. Nous avons bien reçu votre message concernant :</p>
                        <p style="padding: 15px; background-color: #f3f4f6; border-left: 4px solid #2563eb; margin: 20px 0;">
                            <strong>${subject}</strong>
                        </p>
                        <p>Notre équipe examinera votre demande et vous répondra dans les <strong>24-48 heures</strong>.</p>
                        <p>Si votre demande est urgente, n'hésitez pas à nous contacter directement à l'adresse : 
                        <a href="mailto:contact@tradelab-studio.fr">contact@tradelab-studio.fr</a></p>
                        
                        <div class="footer">
                            <p><strong>TradeLab Studio</strong> - Votre plateforme d'apprentissage du trading</p>
                            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `

        const textContentToUser = `
Message bien reçu !

Bonjour ${firstName},

Merci de nous avoir contactés. Nous avons bien reçu votre message concernant :
"${subject}"

Notre équipe examinera votre demande et vous répondra dans les 24-48 heures.

Si votre demande est urgente, n'hésitez pas à nous contacter directement à l'adresse : contact@tradelab-studio.fr

---
TradeLab Studio - Votre plateforme d'apprentissage du trading
        `

        // Envoi des deux emails
        await Promise.all([
            // Email à l'équipe
            this.sendMail({
                from: `"TradeLab Contact Form" <${this.configService.get("EMAIL_USER")}>`,
                to: this.configService.get("EMAIL_USER"),
                replyTo: email,
                subject: `[Contact] ${subject}`,
                text: textContentToTeam,
                html: htmlContentToTeam,
            }),
            // Email de confirmation à l'utilisateur
            this.sendMail({
                from: `"TradeLab Studio" <${this.configService.get("EMAIL_USER")}>`,
                to: email,
                subject: "Nous avons bien reçu votre message - TradeLab Studio",
                text: textContentToUser,
                html: htmlContentToUser,
            }),
        ])
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
