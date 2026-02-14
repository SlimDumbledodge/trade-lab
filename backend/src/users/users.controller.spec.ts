import { Test, TestingModule } from "@nestjs/testing"
import { NotFoundException } from "@nestjs/common"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

describe("UsersController", () => {
    let controller: UsersController
    let usersService: UsersService

    const mockUsersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile()

        controller = module.get<UsersController>(UsersController)
        usersService = module.get<UsersService>(UsersService)

        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    describe("create", () => {
        it("devrait créer un user et retourner le résultat", async () => {
            const createDto = { username: "testuser", email: "test@example.com", password: "password123" }
            const mockResult = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                portfolio: { id: 1, portfolioAssets: [] },
            }

            mockUsersService.create.mockResolvedValue(mockResult)

            const result = await controller.create(createDto)

            expect(result).toEqual(mockResult)
            expect(usersService.create).toHaveBeenCalledWith(createDto)
            expect(usersService.create).toHaveBeenCalledTimes(1)
        })
    })

    describe("findAll", () => {
        it("devrait retourner tous les utilisateurs", async () => {
            const mockUsers = [
                { id: 1, username: "user1" },
                { id: 2, username: "user2" },
            ]

            mockUsersService.findAll.mockResolvedValue(mockUsers)

            const result = await controller.findAll()

            expect(result).toEqual(mockUsers)
            expect(usersService.findAll).toHaveBeenCalledTimes(1)
        })
    })

    describe("findOne", () => {
        it("devrait retourner un user par son id", async () => {
            const mockUser = { id: 1, username: "testuser", email: "test@example.com" }

            mockUsersService.findOne.mockResolvedValue(mockUser)

            const result = await controller.findOne(1)

            expect(result).toEqual(mockUser)
            expect(usersService.findOne).toHaveBeenCalledWith(1)
        })

        it("devrait propager NotFoundException si le user n'existe pas", async () => {
            mockUsersService.findOne.mockRejectedValue(new NotFoundException("User with ID 999 not found !"))

            await expect(controller.findOne(999)).rejects.toThrow(NotFoundException)
        })
    })

    describe("update", () => {
        it("devrait mettre à jour le user et retourner le résultat", async () => {
            const updateDto = { username: "updated" }
            const mockResult = { id: 1, username: "updated", email: "test@example.com" }

            mockUsersService.update.mockResolvedValue(mockResult)

            const result = await controller.update(1, updateDto)

            expect(result).toEqual(mockResult)
            expect(usersService.update).toHaveBeenCalledWith(1, updateDto)
        })
    })

    describe("remove", () => {
        it("devrait supprimer le user et retourner le résultat", async () => {
            const mockResult = { id: 1, username: "testuser" }

            mockUsersService.remove.mockResolvedValue(mockResult)

            const result = await controller.remove(1)

            expect(result).toEqual(mockResult)
            expect(usersService.remove).toHaveBeenCalledWith(1)
        })
    })
})
