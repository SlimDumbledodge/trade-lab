import { Test, TestingModule } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { UnauthorizedException } from "@nestjs/common"
import { JwtStrategy } from "./jwt.strategy"
import { UsersService } from "../../users/users.service"

describe("JwtStrategy", () => {
    let strategy: JwtStrategy
    let usersService: UsersService

    const mockUsersService = {
        findOne: jest.fn(),
    }

    const mockConfigService = {
        getOrThrow: jest.fn().mockReturnValue("test-jwt-secret"),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile()

        strategy = module.get<JwtStrategy>(JwtStrategy)
        usersService = module.get<UsersService>(UsersService)

        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(strategy).toBeDefined()
    })

    describe("validate", () => {
        it("devrait retourner le user enrichi avec portfolioId quand le user existe", async () => {
            const mockUser = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                portfolio: { id: 42 },
            }

            mockUsersService.findOne.mockResolvedValue(mockUser)

            const result = await strategy.validate({ userId: 1 })

            expect(usersService.findOne).toHaveBeenCalledWith(1)
            expect(result).toEqual({
                ...mockUser,
                portfolioId: 42,
            })
        })

        it("devrait lancer UnauthorizedException quand le user n'existe pas", async () => {
            mockUsersService.findOne.mockResolvedValue(null)

            await expect(strategy.validate({ userId: 999 })).rejects.toThrow(UnauthorizedException)
            expect(usersService.findOne).toHaveBeenCalledWith(999)
        })

        it("devrait retourner portfolioId undefined quand le user n'a pas de portfolio", async () => {
            const mockUser = {
                id: 2,
                username: "noportfolio",
                email: "noportfolio@example.com",
                portfolio: null,
            }

            mockUsersService.findOne.mockResolvedValue(mockUser)

            const result = await strategy.validate({ userId: 2 })

            expect(result).toEqual({
                ...mockUser,
                portfolioId: undefined,
            })
        })

        it("devrait appeler findOne avec le userId extrait du payload JWT", async () => {
            const mockUser = {
                id: 7,
                username: "user7",
                email: "user7@example.com",
                portfolio: { id: 100 },
            }

            mockUsersService.findOne.mockResolvedValue(mockUser)

            await strategy.validate({ userId: 7 })

            expect(usersService.findOne).toHaveBeenCalledTimes(1)
            expect(usersService.findOne).toHaveBeenCalledWith(7)
        })
    })
})
