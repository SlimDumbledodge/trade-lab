import { Test, TestingModule } from "@nestjs/testing"
import { FavoritesController } from "./favorites.controller"
import { FavoritesService } from "./favorites.service"

describe("FavoritesController", () => {
    let controller: FavoritesController
    let favoritesService: FavoritesService

    const mockFavoritesService = {
        findAll: jest.fn(),
        add: jest.fn(),
        remove: jest.fn(),
    }

    beforeEach(async () => {
        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            controllers: [FavoritesController],
            providers: [
                {
                    provide: FavoritesService,
                    useValue: mockFavoritesService,
                },
            ],
        }).compile()

        controller = module.get<FavoritesController>(FavoritesController)
        favoritesService = module.get<FavoritesService>(FavoritesService)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    // ─── findAll ───────────────────────────────────────────────────────────────

    describe("findAll", () => {
        it("devrait retourner les favoris de l'utilisateur", async () => {
            const mockFavorites = [
                { id: 1, userId: 1, assetId: 10, createdAt: new Date(), asset: { id: 10, symbol: "AAPL", name: "Apple Inc." } },
                { id: 2, userId: 1, assetId: 20, createdAt: new Date(), asset: { id: 20, symbol: "MSFT", name: "Microsoft" } },
            ]
            mockFavoritesService.findAll.mockResolvedValue(mockFavorites)

            const result = await controller.findAll(1)

            expect(result).toEqual(mockFavorites)
            expect(mockFavoritesService.findAll).toHaveBeenCalledWith(1)
        })

        it("devrait retourner un tableau vide si aucun favori", async () => {
            mockFavoritesService.findAll.mockResolvedValue([])

            const result = await controller.findAll(1)

            expect(result).toEqual([])
            expect(mockFavoritesService.findAll).toHaveBeenCalledWith(1)
        })

        it("devrait propager les erreurs du service", async () => {
            mockFavoritesService.findAll.mockRejectedValue(new Error("Service error"))

            await expect(controller.findAll(1)).rejects.toThrow("Service error")
        })
    })

    // ─── add ───────────────────────────────────────────────────────────────────

    describe("add", () => {
        it("devrait ajouter un favori et retourner le résultat", async () => {
            const mockFavorite = { id: 1, userId: 1, assetId: 10, createdAt: new Date() }
            mockFavoritesService.add.mockResolvedValue(mockFavorite)

            const result = await controller.add(1, 10)

            expect(result).toEqual(mockFavorite)
            expect(mockFavoritesService.add).toHaveBeenCalledWith(1, 10)
        })

        it("devrait passer le bon userId et assetId au service", async () => {
            mockFavoritesService.add.mockResolvedValue({})

            await controller.add(42, 99)

            expect(mockFavoritesService.add).toHaveBeenCalledWith(42, 99)
        })

        it("devrait propager les erreurs du service", async () => {
            mockFavoritesService.add.mockRejectedValue(new Error("Asset not found"))

            await expect(controller.add(1, 999)).rejects.toThrow("Asset not found")
        })
    })

    // ─── remove ────────────────────────────────────────────────────────────────

    describe("remove", () => {
        it("devrait supprimer un favori et retourner le résultat", async () => {
            mockFavoritesService.remove.mockResolvedValue({ count: 1 })

            const result = await controller.remove(1, 10)

            expect(result).toEqual({ count: 1 })
            expect(mockFavoritesService.remove).toHaveBeenCalledWith(1, 10)
        })

        it("devrait passer le bon userId et assetId au service", async () => {
            mockFavoritesService.remove.mockResolvedValue({ count: 0 })

            await controller.remove(42, 99)

            expect(mockFavoritesService.remove).toHaveBeenCalledWith(42, 99)
        })

        it("devrait propager les erreurs du service", async () => {
            mockFavoritesService.remove.mockRejectedValue(new Error("Database error"))

            await expect(controller.remove(1, 10)).rejects.toThrow("Database error")
        })
    })
})
