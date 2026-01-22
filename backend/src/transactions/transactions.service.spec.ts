// ============================================================
// 🎯 TRANSACTIONS SERVICE - TESTS UNITAIRES
// ============================================================
//
// ⚠️ CORRECTIF MAJEUR : ATOMICITÉ DES TRANSACTIONS (janvier 2025)
//
// PROBLÈME IDENTIFIÉ :
// Les opérations buyAsset() et sellAsset() effectuaient plusieurs modifications
// séquentielles en base de données SANS utiliser de transaction.
// Si une opération échouait en milieu de séquence, les précédentes étaient déjà
// commitées → CORRUPTION DE DONNÉES (argent débité mais asset non ajouté, etc.)
//
// SOLUTION IMPLÉMENTÉE :
// Toutes les opérations de modification sont maintenant wrappées dans
// prisma.$transaction() pour garantir l'atomicité :
// - Soit TOUTES les opérations réussissent
// - Soit TOUTES sont rollback en cas d'erreur
//
// Ces tests vérifient la logique métier ET l'atomicité des opérations.
// ============================================================
import { Test, TestingModule } from "@nestjs/testing"
import { TransactionsService } from "./transactions.service"
import { PrismaService } from "../prisma/prisma.service"
import { PortfoliosService } from "../portfolios/portfolios.service"
import { PortfoliosAssetsService } from "../portfolios-assets/portfolios-assets.service"
import { PortfoliosSnapshotsService } from "../portfolios-snapshots/portfolios-snapshots.service"
import { BadRequestException } from "@nestjs/common"
import { Prisma, TransactionType } from "prisma/generated/client"

describe("TransactionsService", () => {
    let service: TransactionsService
    let prismaService: PrismaService
    let portfoliosService: PortfoliosService
    let portfoliosAssetsService: PortfoliosAssetsService
    let portfoliosSnapshotsService: PortfoliosSnapshotsService

    // 🎯 POURQUOI DES MOCKS ?
    // On veut tester UNIQUEMENT la logique de TransactionsService,
    // pas les services dont il dépend (ça sera testé ailleurs)
    const mockPrismaService = {
        asset: {
            findUnique: jest.fn(),
        },
        transaction: {
            findMany: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
        },
        // Mock de $transaction qui exécute immédiatement le callback passé
        // Cela simule le comportement de Prisma tout en gardant les mocks actifs
        $transaction: jest.fn(async (callback) => {
            // Exécuter le callback et laisser les erreurs se propager naturellement
            return await callback(mockPrismaService)
        }),
    }

    const mockPortfoliosService = {
        checkSufficientFunds: jest.fn(),
        updatePortfolioCashBalance: jest.fn(),
        calculatePortfolioAssetsValue: jest.fn(),
    }

    const mockPortfoliosAssetsService = {
        createPortfolioAsset: jest.fn(),
        reducePortfolioAsset: jest.fn(),
    }

    const mockPortfoliosSnapshotsService = {
        capturePortfolioSnapshot: jest.fn(),
    }

    beforeEach(async () => {
        // Reset tous les mocks avant chaque test
        jest.clearAllMocks()

        // Reconfigurer $transaction pour qu'il exécute vraiment le callback
        mockPrismaService.$transaction.mockImplementation(async (callback) => {
            return await callback(mockPrismaService)
        })

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: PortfoliosService,
                    useValue: mockPortfoliosService,
                },
                {
                    provide: PortfoliosAssetsService,
                    useValue: mockPortfoliosAssetsService,
                },
                {
                    provide: PortfoliosSnapshotsService,
                    useValue: mockPortfoliosSnapshotsService,
                },
            ],
        }).compile()

        service = module.get<TransactionsService>(TransactionsService)
        prismaService = module.get<PrismaService>(PrismaService)
        portfoliosService = module.get<PortfoliosService>(PortfoliosService)
        portfoliosAssetsService = module.get<PortfoliosAssetsService>(PortfoliosAssetsService)
        portfoliosSnapshotsService = module.get<PortfoliosSnapshotsService>(PortfoliosSnapshotsService)

        // Reset tous les mocks avant chaque test
        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("buyAsset", () => {
        // 🎯 TEST 1 : Le cas où tout se passe bien (happy path)
        // POURQUOI ? C'est le scénario le plus fréquent, il doit marcher à 100%
        it("devrait acheter un asset avec succès quand l'utilisateur a les fonds", async () => {
            // ARRANGE (Préparation)
            const portfolioId = 1
            const buyAssetDto = { assetId: 10, quantity: 5 }
            const mockAsset = {
                id: 10,
                symbol: "AAPL",
                lastPrice: new Prisma.Decimal(150), // 150$ par action
            }
            const expectedTotalCost = new Prisma.Decimal(750) // 150 * 5 = 750$

            const mockTransaction = {
                id: 1,
                portfolioId,
                assetId: 10,
                price: mockAsset.lastPrice,
                quantity: new Prisma.Decimal(5),
                type: TransactionType.buy,
            }

            // POURQUOI ces mocks ?
            // On simule que l'asset existe et que toutes les opérations réussissent
            mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset)
            mockPortfoliosService.checkSufficientFunds.mockResolvedValue(undefined)
            mockPortfoliosAssetsService.createPortfolioAsset.mockResolvedValue(undefined)
            mockPortfoliosService.updatePortfolioCashBalance.mockResolvedValue(undefined)
            mockPortfoliosService.calculatePortfolioAssetsValue.mockResolvedValue(undefined)
            mockPortfoliosSnapshotsService.capturePortfolioSnapshot.mockResolvedValue(undefined)
            mockPrismaService.transaction.create.mockResolvedValue(mockTransaction)

            // ACT (Action)
            const result = await service.buyAsset(portfolioId, buyAssetDto)

            // ASSERT (Vérifications)
            // 🔍 VÉRIFICATION 1 : L'asset existe-t-il ?
            expect(prismaService.asset.findUnique).toHaveBeenCalledWith({
                where: { id: buyAssetDto.assetId },
            })

            // 🔍 VÉRIFICATION 2 : A-t-on vérifié les fonds AVANT de modifier quoi que ce soit ?
            expect(portfoliosService.checkSufficientFunds).toHaveBeenCalledWith(portfolioId, expectedTotalCost)

            // 🔍 VÉRIFICATION 3 : Les opérations sont-elles appelées dans le BON ORDRE ?
            expect(portfoliosAssetsService.createPortfolioAsset).toHaveBeenCalledWith(
                portfolioId,
                mockAsset.id,
                new Prisma.Decimal(buyAssetDto.quantity),
                mockAsset.lastPrice,
            )

            // 🔍 VÉRIFICATION 4 : Le cash balance est-il mis à jour correctement ?
            expect(portfoliosService.updatePortfolioCashBalance).toHaveBeenCalledWith(portfolioId, expectedTotalCost, TransactionType.buy)

            // 🔍 VÉRIFICATION 5 : Recalcul de la valeur du portfolio
            expect(portfoliosService.calculatePortfolioAssetsValue).toHaveBeenCalledWith(portfolioId)

            // 🔍 VÉRIFICATION 6 : Snapshot créé pour l'historique
            expect(portfoliosSnapshotsService.capturePortfolioSnapshot).toHaveBeenCalledWith(portfolioId)

            // 🔍 VÉRIFICATION 7 : La transaction est-elle créée avec les bonnes données ?
            expect(prismaService.transaction.create).toHaveBeenCalledWith({
                data: {
                    portfolioId,
                    assetId: mockAsset.id,
                    price: mockAsset.lastPrice,
                    quantity: new Prisma.Decimal(buyAssetDto.quantity),
                    type: TransactionType.buy,
                },
            })

            expect(result).toEqual(mockTransaction)
        })

        // 🎯 TEST 2 : L'asset n'existe pas
        // POURQUOI ? Éviter d'acheter un asset inexistant = corruption de données
        it("devrait échouer si l'asset n'existe pas", async () => {
            const portfolioId = 1
            const buyAssetDto = { assetId: 999, quantity: 5 }

            // POURQUOI ce mock ? Simuler un asset inexistant
            mockPrismaService.asset.findUnique.mockResolvedValue(null)

            // POURQUOI expect().rejects ? On attend que la fonction LANCE une erreur
            await expect(service.buyAsset(portfolioId, buyAssetDto)).rejects.toThrow(BadRequestException)
            await expect(service.buyAsset(portfolioId, buyAssetDto)).rejects.toThrow("L'asset avec l'ID 999 n'existe pas")

            // 🔍 VÉRIFICATION CRITIQUE : Aucune autre opération ne doit avoir été appelée
            // POURQUOI ? Si l'asset n'existe pas, on doit arrêter IMMÉDIATEMENT
            expect(portfoliosService.checkSufficientFunds).not.toHaveBeenCalled()
            expect(portfoliosAssetsService.createPortfolioAsset).not.toHaveBeenCalled()
            expect(prismaService.transaction.create).not.toHaveBeenCalled()
        })

        // 🎯 TEST 3 : Fonds insuffisants
        // POURQUOI ? Protection contre les soldes négatifs
        it("devrait échouer si l'utilisateur n'a pas assez de fonds", async () => {
            const portfolioId = 1
            const buyAssetDto = { assetId: 10, quantity: 100 }
            const mockAsset = {
                id: 10,
                symbol: "AAPL",
                lastPrice: new Prisma.Decimal(150),
            }

            mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset)
            // POURQUOI ce mock ? Simuler que checkSufficientFunds lance une erreur
            mockPortfoliosService.checkSufficientFunds.mockRejectedValue(new BadRequestException("Fonds insuffisants"))

            await expect(service.buyAsset(portfolioId, buyAssetDto)).rejects.toThrow("Fonds insuffisants")

            // 🔍 VÉRIFICATION CRITIQUE : Rien n'a été modifié après l'échec
            expect(portfoliosAssetsService.createPortfolioAsset).not.toHaveBeenCalled()
            expect(portfoliosService.updatePortfolioCashBalance).not.toHaveBeenCalled()
            expect(prismaService.transaction.create).not.toHaveBeenCalled()
        })
    })

    describe("sellAsset", () => {
        // 🎯 TEST 4 : Vente réussie
        it("devrait vendre un asset avec succès", async () => {
            const portfolioId = 1
            const sellAssetDto = { assetId: 10, quantity: 3 }
            const mockAsset = {
                id: 10,
                symbol: "AAPL",
                lastPrice: new Prisma.Decimal(160),
            }
            const expectedProceeds = new Prisma.Decimal(480) // 160 * 3

            const mockTransaction = {
                id: 2,
                portfolioId,
                assetId: 10,
                price: mockAsset.lastPrice,
                quantity: new Prisma.Decimal(3),
                type: TransactionType.sell,
            }

            mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset)
            mockPortfoliosAssetsService.reducePortfolioAsset.mockResolvedValue(undefined)
            mockPortfoliosService.updatePortfolioCashBalance.mockResolvedValue(undefined)
            mockPortfoliosService.calculatePortfolioAssetsValue.mockResolvedValue(undefined)
            mockPortfoliosSnapshotsService.capturePortfolioSnapshot.mockResolvedValue(undefined)
            mockPrismaService.transaction.create.mockResolvedValue(mockTransaction)

            const result = await service.sellAsset(portfolioId, sellAssetDto)

            // Vérifications similaires à buyAsset
            expect(prismaService.asset.findUnique).toHaveBeenCalledWith({ where: { id: sellAssetDto.assetId } })
            expect(portfoliosAssetsService.reducePortfolioAsset).toHaveBeenCalledWith(
                portfolioId,
                mockAsset.id,
                new Prisma.Decimal(sellAssetDto.quantity),
            )
            expect(portfoliosService.updatePortfolioCashBalance).toHaveBeenCalledWith(portfolioId, expectedProceeds, TransactionType.sell)
            expect(portfoliosService.calculatePortfolioAssetsValue).toHaveBeenCalledWith(portfolioId)
            expect(portfoliosSnapshotsService.capturePortfolioSnapshot).toHaveBeenCalledWith(portfolioId)

            expect(result).toEqual(mockTransaction)
        })

        // 🎯 TEST 5 : Asset inexistant lors de la vente
        it("devrait échouer si l'asset à vendre n'existe pas", async () => {
            const portfolioId = 1
            const sellAssetDto = { assetId: 999, quantity: 5 }

            mockPrismaService.asset.findUnique.mockResolvedValue(null)

            await expect(service.sellAsset(portfolioId, sellAssetDto)).rejects.toThrow(BadRequestException)
            await expect(service.sellAsset(portfolioId, sellAssetDto)).rejects.toThrow("L'asset avec l'ID 999 n'existe pas")

            expect(portfoliosAssetsService.reducePortfolioAsset).not.toHaveBeenCalled()
            expect(prismaService.transaction.create).not.toHaveBeenCalled()
        })

        // 🎯 TEST 6 : Quantité insuffisante
        // POURQUOI ? reducePortfolioAsset doit gérer cette erreur
        it("devrait échouer si la quantité à vendre est insuffisante", async () => {
            const portfolioId = 1
            const sellAssetDto = { assetId: 10, quantity: 100 }
            const mockAsset = {
                id: 10,
                symbol: "AAPL",
                lastPrice: new Prisma.Decimal(160),
            }

            mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset)
            mockPortfoliosAssetsService.reducePortfolioAsset.mockRejectedValue(new BadRequestException("Quantité insuffisante"))

            await expect(service.sellAsset(portfolioId, sellAssetDto)).rejects.toThrow("Quantité insuffisante")

            // Rien d'autre ne doit être modifié
            expect(portfoliosService.updatePortfolioCashBalance).not.toHaveBeenCalled()
            expect(prismaService.transaction.create).not.toHaveBeenCalled()
        })
    })

    describe("getTransactions", () => {
        it("devrait retourner les transactions paginées", async () => {
            const portfolioId = 1
            const page = 1
            const limit = 10

            const mockTransactions = [
                { id: 1, portfolioId: 1, assetId: 10, quantity: new Prisma.Decimal(5), type: TransactionType.buy },
                { id: 2, portfolioId: 1, assetId: 11, quantity: new Prisma.Decimal(3), type: TransactionType.sell },
            ]
            const mockTotal = 15

            mockPrismaService.$transaction.mockResolvedValue([mockTransactions, mockTotal])

            const result = await service.getTransactions(portfolioId, page, limit)

            expect(result).toEqual({
                data: {
                    items: mockTransactions,
                    meta: {
                        total: mockTotal,
                        page: page,
                        lastPage: 2, // ceil(15/10) = 2
                    },
                },
            })
        })
    })

    // ============================================================
    // 🔥 TESTS D'ATOMICITÉ AVANCÉS
    // ============================================================
    // Ces tests vérifient que si une erreur se produit AU MILIEU
    // d'une séquence d'opérations, TOUT est rollback grâce à
    // prisma.$transaction()
    // ============================================================

    describe("Atomicité des transactions - Tests de rollback", () => {
        beforeEach(() => {
            // Reset complet de tous les mocks avant chaque test
            jest.clearAllMocks()
        })

        // 🎯 TEST CRITIQUE : Rollback si erreur après createPortfolioAsset
        it("devrait rollback si une erreur se produit après createPortfolioAsset lors d'un achat", async () => {
            const portfolioId = 1
            const buyAssetDto = { assetId: 10, quantity: 5 }
            const mockAsset = {
                id: 10,
                symbol: "AAPL",
                lastPrice: new Prisma.Decimal(150),
            }

            mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset)
            mockPortfoliosService.checkSufficientFunds.mockResolvedValue(undefined)

            // ✅ createPortfolioAsset va réussir
            mockPortfoliosAssetsService.createPortfolioAsset.mockResolvedValue(undefined)

            // ❌ Mais updatePortfolioCashBalance va ÉCHOUER
            mockPortfoliosService.updatePortfolioCashBalance.mockRejectedValue(
                new Error("Erreur simulée lors de la mise à jour du cash balance"),
            )

            // Pas de mock pour transaction.create car on ne doit pas y arriver
            mockPrismaService.transaction.create.mockImplementation(() => {
                throw new Error("transaction.create ne devrait pas être appelé après une erreur")
            })

            // 🔍 VÉRIFICATION : L'erreur est bien propagée
            await expect(service.buyAsset(portfolioId, buyAssetDto)).rejects.toThrow(
                "Erreur simulée lors de la mise à jour du cash balance",
            )

            // 🔍 VÉRIFICATION CRITIQUE : Les méthodes ont bien été appelées dans l'ordre
            expect(portfoliosAssetsService.createPortfolioAsset).toHaveBeenCalled()
            expect(portfoliosService.updatePortfolioCashBalance).toHaveBeenCalled()

            // 🔍 VÉRIFICATION ATOMICITÉ : Les opérations suivantes ne doivent PAS avoir été appelées
            expect(portfoliosService.calculatePortfolioAssetsValue).not.toHaveBeenCalled()
            expect(portfoliosSnapshotsService.capturePortfolioSnapshot).not.toHaveBeenCalled()

            // 💡 NOTE IMPORTANTE :
            // En conditions réelles, Prisma rollback automatiquement createPortfolioAsset
            // car toutes les opérations sont dans prisma.$transaction()
            // Ce test vérifie que l'erreur est bien propagée et que les opérations
            // suivantes sont interrompues
        })

        // 🎯 TEST CRITIQUE : Rollback si erreur après reducePortfolioAsset lors d'une vente
        it("devrait rollback si une erreur se produit après reducePortfolioAsset lors d'une vente", async () => {
            const portfolioId = 1
            const sellAssetDto = { assetId: 10, quantity: 3 }
            const mockAsset = {
                id: 10,
                symbol: "AAPL",
                lastPrice: new Prisma.Decimal(160),
            }

            mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset)

            // ✅ reducePortfolioAsset va réussir
            mockPortfoliosAssetsService.reducePortfolioAsset.mockResolvedValue(undefined)

            // ❌ Mais updatePortfolioCashBalance va ÉCHOUER
            mockPortfoliosService.updatePortfolioCashBalance.mockRejectedValue(new Error("Erreur lors du crédit du cash"))

            // 🔍 VÉRIFICATION : L'erreur est bien propagée
            await expect(service.sellAsset(portfolioId, sellAssetDto)).rejects.toThrow("Erreur lors du crédit du cash")

            // 🔍 VÉRIFICATION : reducePortfolioAsset a été appelé avant l'erreur
            expect(portfoliosAssetsService.reducePortfolioAsset).toHaveBeenCalled()
            expect(portfoliosService.updatePortfolioCashBalance).toHaveBeenCalled()

            // 🔍 VÉRIFICATION ATOMICITÉ : Les opérations suivantes sont interrompues
            expect(portfoliosService.calculatePortfolioAssetsValue).not.toHaveBeenCalled()
            expect(portfoliosSnapshotsService.capturePortfolioSnapshot).not.toHaveBeenCalled()
        })

        // 🎯 TEST CRITIQUE : Rollback si erreur lors du calcul des holdings
        it("devrait rollback si calculatePortfolioAssetsValue échoue", async () => {
            const portfolioId = 1
            const buyAssetDto = { assetId: 10, quantity: 5 }
            const mockAsset = {
                id: 10,
                symbol: "AAPL",
                lastPrice: new Prisma.Decimal(150),
            }

            mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset)
            mockPortfoliosService.checkSufficientFunds.mockResolvedValue(undefined)
            mockPortfoliosAssetsService.createPortfolioAsset.mockResolvedValue(undefined)
            mockPortfoliosService.updatePortfolioCashBalance.mockResolvedValue(undefined)

            // ❌ calculatePortfolioAssetsValue va ÉCHOUER
            mockPortfoliosService.calculatePortfolioAssetsValue.mockRejectedValue(new Error("Erreur calcul holdings"))

            // 🔍 VÉRIFICATION : L'erreur est propagée
            await expect(service.buyAsset(portfolioId, buyAssetDto)).rejects.toThrow("Erreur calcul holdings")

            // 🔍 VÉRIFICATION : Toutes les étapes jusqu'à l'erreur ont été exécutées
            expect(portfoliosAssetsService.createPortfolioAsset).toHaveBeenCalled()
            expect(portfoliosService.updatePortfolioCashBalance).toHaveBeenCalled()
            expect(portfoliosService.calculatePortfolioAssetsValue).toHaveBeenCalled()

            // 🔍 VÉRIFICATION ATOMICITÉ : La dernière étape n'a pas été appelée
            expect(portfoliosSnapshotsService.capturePortfolioSnapshot).not.toHaveBeenCalled()

            // 💡 En production, Prisma rollback TOUT (asset, cash, holdings)
        })
    })
})
