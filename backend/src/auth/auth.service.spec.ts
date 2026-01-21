import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { PrismaService } from "../prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"
import { EmailService } from "../email/email.service"
import { NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"

describe("AuthService", () => {
    let service: AuthService
    let prismaService: PrismaService
    let jwtService: JwtService
    let emailService: EmailService

    // Mock des services
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    }

    const mockJwtService = {
        sign: jest.fn(),
    }

    const mockEmailService = {
        sendResetPasswordLink: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: EmailService,
                    useValue: mockEmailService,
                },
            ],
        }).compile()

        service = module.get<AuthService>(AuthService)
        prismaService = module.get<PrismaService>(PrismaService)
        jwtService = module.get<JwtService>(JwtService)
        emailService = module.get<EmailService>(EmailService)

        // Reset des mocks avant chaque test
        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("login", () => {
        it("devrait retourner un token JWT et les infos utilisateur pour des identifiants valides", async () => {
            const mockUser = {
                id: 1,
                email: "test@example.com",
                passwordHash: await bcrypt.hash("password123", 10),
                portfolio: { id: 10 },
            }

            const mockToken = "jwt-token-123"

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
            mockJwtService.sign.mockReturnValue(mockToken)

            const result = await service.login("test@example.com", "password123")

            expect(result).toEqual({
                accessToken: mockToken,
                user: {
                    ...mockUser,
                    portfolioId: 10,
                },
            })
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: "test@example.com" },
                include: { portfolio: true },
            })
            expect(jwtService.sign).toHaveBeenCalledWith({ userId: 1 })
        })

        it("devrait lancer NotFoundException si l'utilisateur n'existe pas", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null)

            await expect(service.login("inexistant@example.com", "password123")).rejects.toThrow(NotFoundException)
            await expect(service.login("inexistant@example.com", "password123")).rejects.toThrow(
                "No user found for email: inexistant@example.com",
            )
        })

        it("devrait lancer UnauthorizedException si le mot de passe est invalide", async () => {
            const mockUser = {
                id: 1,
                email: "test@example.com",
                passwordHash: await bcrypt.hash("correct-password", 10),
                portfolio: { id: 10 },
            }

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

            await expect(service.login("test@example.com", "wrong-password")).rejects.toThrow(UnauthorizedException)
            await expect(service.login("test@example.com", "wrong-password")).rejects.toThrow("Invalid password")
        })

        it("devrait gérer le cas où l'utilisateur n'a pas de portfolio", async () => {
            const mockUser = {
                id: 1,
                email: "test@example.com",
                passwordHash: await bcrypt.hash("password123", 10),
                portfolio: null,
            }

            const mockToken = "jwt-token-123"

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
            mockJwtService.sign.mockReturnValue(mockToken)

            const result = await service.login("test@example.com", "password123")

            expect(result.user.portfolioId).toBeNull()
        })
    })

    describe("forgotPassword", () => {
        it("devrait envoyer un email de réinitialisation si l'utilisateur existe", async () => {
            const mockUser = {
                id: 1,
                email: "test@example.com",
            }

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
            mockEmailService.sendResetPasswordLink.mockResolvedValue(undefined)

            const result = await service.forgotPassword("test@example.com")

            expect(result).toEqual({
                message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
            })
            expect(emailService.sendResetPasswordLink).toHaveBeenCalledWith("test@example.com")
        })

        it("devrait retourner le même message si l'utilisateur n'existe pas (sécurité)", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null)

            const result = await service.forgotPassword("inexistant@example.com")

            expect(result).toEqual({
                message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
            })
            expect(emailService.sendResetPasswordLink).not.toHaveBeenCalled()
        })
    })

    describe("resetPassword", () => {
        it("devrait réinitialiser le mot de passe avec un token valide", async () => {
            const plainToken = "plain-token-123"
            const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex")

            const mockUser = {
                id: 1,
                email: "test@example.com",
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 3600000), // 1h dans le futur
            }

            mockPrismaService.user.findFirst.mockResolvedValue(mockUser)
            mockPrismaService.user.update.mockResolvedValue(mockUser)

            const result = await service.resetPassword(plainToken, "newPassword123")

            expect(result).toEqual({
                message: "Mot de passe réinitialisé avec succès",
            })
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    passwordHash: expect.any(String),
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                },
            })
        })

        it("devrait lancer BadRequestException si le token est invalide", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(null)

            await expect(service.resetPassword("invalid-token", "newPassword123")).rejects.toThrow(BadRequestException)
            await expect(service.resetPassword("invalid-token", "newPassword123")).rejects.toThrow("Token invalide ou expiré")
        })

        it("devrait lancer BadRequestException si le token est expiré", async () => {
            const plainToken = "expired-token"

            // Le findFirst ne retournera rien car la condition resetPasswordExpires > now ne sera pas remplie
            mockPrismaService.user.findFirst.mockResolvedValue(null)

            await expect(service.resetPassword(plainToken, "newPassword123")).rejects.toThrow(BadRequestException)
        })
    })
})
