import { Test, TestingModule } from "@nestjs/testing"
import { FavoritesService } from "./favorites.service"
import { PrismaService } from "../prisma/prisma.service"

describe("FavoritesService", () => {
    let service: FavoritesService

    const mockPrismaService = {
        favorite: {
            findMany: jest.fn(),
            upsert: jest.fn(),
            deleteMany: jest.fn(),
        },
    }

    beforeEach(async () => {
        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FavoritesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile()

        service = module.get<FavoritesService>(FavoritesService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    // ─── findAll ───────────────────────────────────────────────────────────────

    describe("findAll", () => {
        it("devrait retourner tous les favoris d'un utilisateur avec les assets inclus", async () => {
            const mockFavorites = [
                { id: 1, userId: 1, assetId: 10, createdAt: new Date(), asset: { id: 10, symbol: "AAPL", name: "Apple Inc." } },
                { id: 2, userId: 1, assetId: 20, createdAt: new Date(), asset: { id: 20, symbol: "MSFT", name: "Microsoft" } },
            ]
            mockPrismaService.favorite.findMany.mockResolvedValue(mockFavorites)

            const result = await service.findAll(1)

            expect(result).toEqual(mockFavorites)
            expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith({
                where: { userId: 1 },
                include: { asset: true },
            })
        })

        it("devrait retourner un tableau vide si l'utilisateur n'a aucun favori", async () => {
            mockPrismaService.favorite.findMany.mockResolvedValue([])

            const result = await service.findAll(99)

            expect(result).toEqual([])
            expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith({
                where: { userId: 99 },
                include: { asset: true },
            })
        })

        it("devrait propager les erreurs Prisma", async () => {
            mockPrismaService.favorite.findMany.mockRejectedValue(new Error("Database error"))

            await expect(service.findAll(1)).rejects.toThrow("Database error")
        })
    })

    // ─── add ───────────────────────────────────────────────────────────────────

    describe("add", () => {
        it("devrait ajouter un favori avec un upsert", async () => {
            const mockFavorite = { id: 1, userId: 1, assetId: 10, createdAt: new Date() }
            mockPrismaService.favorite.upsert.mockResolvedValue(mockFavorite)

            const result = await service.add(1, 10)

            expect(result).toEqual(mockFavorite)
            expect(mockPrismaService.favorite.upsert).toHaveBeenCalledWith({
                where: { userId_assetId: { userId: 1, assetId: 10 } },
                create: { userId: 1, assetId: 10 },
                update: {},
            })
        })

        it("devrait ne pas créer de doublon si le favori existe déjà", async () => {
            const existingFavorite = { id: 1, userId: 1, assetId: 10, createdAt: new Date() }
            mockPrismaService.favorite.upsert.mockResolvedValue(existingFavorite)

            const result = await service.add(1, 10)

            expect(result).toEqual(existingFavorite)
            expect(mockPrismaService.favorite.upsert).toHaveBeenCalledTimes(1)
        })

        it("devrait propager les erreurs Prisma", async () => {
            mockPrismaService.favorite.upsert.mockRejectedValue(new Error("Foreign key constraint"))

            await expect(service.add(1, 999)).rejects.toThrow("Foreign key constraint")
        })
    })

    // ─── remove ────────────────────────────────────────────────────────────────

    describe("remove", () => {
        it("devrait supprimer un favori", async () => {
            mockPrismaService.favorite.deleteMany.mockResolvedValue({ count: 1 })

            const result = await service.remove(1, 10)

            expect(result).toEqual({ count: 1 })
            expect(mockPrismaService.favorite.deleteMany).toHaveBeenCalledWith({
                where: { userId: 1, assetId: 10 },
            })
        })

        it("devrait retourner count 0 si le favori n'existait pas", async () => {
            mockPrismaService.favorite.deleteMany.mockResolvedValue({ count: 0 })

            const result = await service.remove(1, 999)

            expect(result).toEqual({ count: 0 })
            expect(mockPrismaService.favorite.deleteMany).toHaveBeenCalledWith({
                where: { userId: 1, assetId: 999 },
            })
        })

        it("devrait propager les erreurs Prisma", async () => {
            mockPrismaService.favorite.deleteMany.mockRejectedValue(new Error("Database error"))

            await expect(service.remove(1, 10)).rejects.toThrow("Database error")
        })
    })
})
