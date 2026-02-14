import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common"

describe("AuthController", () => {
    let controller: AuthController
    let authService: AuthService

    const mockAuthService = {
        login: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile()

        controller = module.get<AuthController>(AuthController)
        authService = module.get<AuthService>(AuthService)

        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    describe("login", () => {
        it("devrait retourner un accessToken et le user pour des identifiants valides", async () => {
            const mockResult = {
                accessToken: "jwt-token-123",
                user: {
                    id: 1,
                    email: "test@example.com",
                    username: "testuser",
                    portfolioId: 42,
                },
            }

            mockAuthService.login.mockResolvedValue(mockResult)

            const result = await controller.login({
                email: "test@example.com",
                password: "password123",
            })

            expect(result).toEqual(mockResult)
            expect(authService.login).toHaveBeenCalledWith("test@example.com", "password123")
            expect(authService.login).toHaveBeenCalledTimes(1)
        })

        it("devrait propager NotFoundException si le user n'existe pas", async () => {
            mockAuthService.login.mockRejectedValue(new NotFoundException("No user found for email: inexistant@example.com"))

            await expect(controller.login({ email: "inexistant@example.com", password: "password123" })).rejects.toThrow(NotFoundException)
        })

        it("devrait propager UnauthorizedException si le mot de passe est incorrect", async () => {
            mockAuthService.login.mockRejectedValue(new UnauthorizedException("Invalid password"))

            await expect(controller.login({ email: "test@example.com", password: "wrong" })).rejects.toThrow(UnauthorizedException)
        })
    })

    describe("forgotPassword", () => {
        it("devrait retourner un message de succès quand l'email existe", async () => {
            const mockResult = { message: "Si cet email existe, un lien de réinitialisation a été envoyé." }
            mockAuthService.forgotPassword.mockResolvedValue(mockResult)

            const result = await controller.forgotPassword({ email: "test@example.com" })

            expect(result).toEqual(mockResult)
            expect(authService.forgotPassword).toHaveBeenCalledWith("test@example.com")
            expect(authService.forgotPassword).toHaveBeenCalledTimes(1)
        })

        it("devrait retourner le même message quand l'email n'existe pas", async () => {
            const mockResult = { message: "Si cet email existe, un lien de réinitialisation a été envoyé." }
            mockAuthService.forgotPassword.mockResolvedValue(mockResult)

            const result = await controller.forgotPassword({ email: "inexistant@example.com" })

            expect(result).toEqual(mockResult)
            expect(authService.forgotPassword).toHaveBeenCalledWith("inexistant@example.com")
        })
    })

    describe("resetPassword", () => {
        it("devrait retourner un message de succès avec un token valide", async () => {
            const mockResult = { message: "Mot de passe réinitialisé avec succès" }
            mockAuthService.resetPassword.mockResolvedValue(mockResult)

            const result = await controller.resetPassword({
                token: "valid-token",
                newPassword: "newPassword123",
            })

            expect(result).toEqual(mockResult)
            expect(authService.resetPassword).toHaveBeenCalledWith("valid-token", "newPassword123")
            expect(authService.resetPassword).toHaveBeenCalledTimes(1)
        })

        it("devrait propager BadRequestException si le token est invalide", async () => {
            mockAuthService.resetPassword.mockRejectedValue(new BadRequestException("Token invalide ou expiré"))

            await expect(controller.resetPassword({ token: "invalid-token", newPassword: "newPassword123" })).rejects.toThrow(
                BadRequestException,
            )
        })

        it("devrait propager BadRequestException si le token est expiré", async () => {
            mockAuthService.resetPassword.mockRejectedValue(new BadRequestException("Token invalide ou expiré"))

            await expect(controller.resetPassword({ token: "expired-token", newPassword: "newPassword123" })).rejects.toThrow(
                BadRequestException,
            )
        })
    })
})
