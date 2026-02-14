import { Test, TestingModule } from "@nestjs/testing"
import { NotFoundException } from "@nestjs/common"
import { UsersService } from "./users.service"
import { PrismaService } from "../prisma/prisma.service"

describe("UsersService", () => {
    let service: UsersService
    let prismaService: PrismaService

    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile()

        service = module.get<UsersService>(UsersService)
        prismaService = module.get<PrismaService>(PrismaService)

        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("create", () => {
        const createUserDto = {
            username: "testuser",
            email: "test@example.com",
            password: "password123",
        }

        it("devrait hasher le mot de passe avant de créer le user", async () => {
            const mockCreatedUser = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                passwordHash: "hashed-password",
                portfolio: { id: 1, portfolioAssets: [] },
            }

            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser)

            await service.create({ ...createUserDto })

            const createCall = mockPrismaService.user.create.mock.calls[0][0]
            const storedPassword = createCall.data.passwordHash

            // Le password stocké ne doit PAS être le texte brut
            expect(storedPassword).not.toBe("password123")
            // Il doit être un hash bcrypt (commence par $2b$)
            expect(storedPassword).toMatch(/^\$2[aby]\$/)
        })

        it("devrait créer un portfolio automatiquement avec le user", async () => {
            const mockCreatedUser = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                passwordHash: "hashed-password",
                portfolio: { id: 1, portfolioAssets: [] },
            }

            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser)

            await service.create({ ...createUserDto })

            const createCall = mockPrismaService.user.create.mock.calls[0][0]

            // Vérifie que portfolio.create est bien dans les données
            expect(createCall.data.portfolio).toEqual({ create: {} })
            // Vérifie que le résultat inclut le portfolio
            expect(createCall.include.portfolio).toBeDefined()
        })

        it("devrait passer le username et l'email correctement à Prisma", async () => {
            const mockCreatedUser = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                passwordHash: "hashed-password",
                portfolio: { id: 1, portfolioAssets: [] },
            }

            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser)

            const result = await service.create({ ...createUserDto })

            const createCall = mockPrismaService.user.create.mock.calls[0][0]
            expect(createCall.data.username).toBe("testuser")
            expect(createCall.data.email).toBe("test@example.com")
            expect(result).toEqual(mockCreatedUser)
        })
    })

    describe("findAll", () => {
        it("devrait retourner tous les utilisateurs", async () => {
            const mockUsers = [
                { id: 1, username: "user1", email: "user1@example.com" },
                { id: 2, username: "user2", email: "user2@example.com" },
            ]

            mockPrismaService.user.findMany.mockResolvedValue(mockUsers)

            const result = await service.findAll()

            expect(result).toEqual(mockUsers)
            expect(prismaService.user.findMany).toHaveBeenCalledTimes(1)
        })

        it("devrait retourner un tableau vide s'il n'y a aucun utilisateur", async () => {
            mockPrismaService.user.findMany.mockResolvedValue([])

            const result = await service.findAll()

            expect(result).toEqual([])
        })
    })

    describe("findOne", () => {
        it("devrait retourner le user avec son portfolio quand il existe", async () => {
            const mockUser = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                portfolio: {
                    id: 10,
                    portfolioAssets: [{ id: 1, symbol: "AAPL" }],
                },
            }

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

            const result = await service.findOne(1)

            expect(result).toEqual(mockUser)
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    portfolio: {
                        include: {
                            portfolioAssets: true,
                        },
                    },
                },
            })
        })

        it("devrait lancer NotFoundException si le user n'existe pas", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null)

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
            await expect(service.findOne(999)).rejects.toThrow("User with ID 999 not found !")
        })
    })

    describe("update", () => {
        it("devrait re-hasher le password s'il est fourni", async () => {
            const updateDto = { password: "newPassword123" }
            const mockUpdatedUser = { id: 1, username: "testuser", email: "test@example.com" }

            mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser)

            await service.update(1, { ...updateDto })

            const updateCall = mockPrismaService.user.update.mock.calls[0][0]
            // Le password dans data doit être hashé
            expect(updateCall.data.password).not.toBe("newPassword123")
            expect(updateCall.data.password).toMatch(/^\$2[aby]\$/)
        })

        it("ne devrait PAS hasher si le password n'est pas fourni", async () => {
            const updateDto = { username: "newUsername" }
            const mockUpdatedUser = { id: 1, username: "newUsername", email: "test@example.com" }

            mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser)

            await service.update(1, updateDto)

            const updateCall = mockPrismaService.user.update.mock.calls[0][0]
            expect(updateCall.data.username).toBe("newUsername")
            expect(updateCall.data.password).toBeUndefined()
        })

        it("devrait appeler prisma.user.update avec le bon id", async () => {
            const updateDto = { username: "updated" }
            mockPrismaService.user.update.mockResolvedValue({ id: 5, username: "updated" })

            await service.update(5, updateDto)

            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: 5 },
                data: updateDto,
            })
        })
    })

    describe("remove", () => {
        it("devrait supprimer le user par son id", async () => {
            const mockDeletedUser = { id: 1, username: "testuser", email: "test@example.com" }
            mockPrismaService.user.delete.mockResolvedValue(mockDeletedUser)

            const result = await service.remove(1)

            expect(result).toEqual(mockDeletedUser)
            expect(prismaService.user.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            })
        })
    })
})
