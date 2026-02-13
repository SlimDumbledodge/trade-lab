// ============================================================
// 🎯 TRANSACTIONS E2E - TESTS D'INTÉGRATION
// ============================================================
//
// Ces tests vérifient le comportement RÉEL des transactions buy/sell
// avec une vraie base de données PostgreSQL.
//
// OBJECTIFS :
// ✅ Vérifier l'atomicité des transactions (rollback en cas d'erreur)
// ✅ Tester les flows complets d'achat et de vente
// ✅ Vérifier les calculs financiers (cash, holdings, weights, PnL)
// ✅ Tester les cas d'erreur (fonds insuffisants, quantité insuffisante)
//
// ============================================================

import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"
import { Prisma } from "prisma/generated/client"
import * as bcrypt from "bcrypt"

import { MarketStatusGuard } from "../src/market-status/market-status.guard"

describe("Transactions (E2E)", () => {
    let app: INestApplication
    let prisma: PrismaService
    let authToken: string
    let userId: number
    let portfolioId: number
    let assetAppleId: number
    let assetTeslaId: number

    // Fonction helper pour nettoyer la base de données
    async function cleanDatabase() {
        await prisma.transaction.deleteMany()
        await prisma.portfolioSnapshots.deleteMany()
        await prisma.portfolioAsset.deleteMany()
        await prisma.portfolio.deleteMany()
        await prisma.assetPrice.deleteMany() // Supprimer AVANT asset à cause de la FK
        await prisma.asset.deleteMany()
        await prisma.user.deleteMany()
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(MarketStatusGuard)
            .useValue({ canActivate: () => true })
            .compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        prisma = moduleFixture.get<PrismaService>(PrismaService)

        // Nettoyer la base avant les tests
        await cleanDatabase()

        // Créer un utilisateur de test
        const hashedPassword = await bcrypt.hash("TestPassword123!", 10)
        const user = await prisma.user.create({
            data: {
                email: "trader@test.com",
                username: "testtrader",
                passwordHash: hashedPassword,
            },
        })
        userId = user.id

        // Créer un portfolio avec 10000€ de cash
        const portfolio = await prisma.portfolio.create({
            data: {
                userId: userId,
                cashBalance: new Prisma.Decimal(10000),
                holdingsValue: new Prisma.Decimal(0),
            },
        })
        portfolioId = portfolio.id

        // Créer des assets de test (Apple et Tesla)
        const assetApple = await prisma.asset.create({
            data: {
                symbol: "AAPL",
                name: "Apple Inc.",
                lastPrice: new Prisma.Decimal(150), // 150€ par action
                todayPerformance: new Prisma.Decimal(0),
            },
        })
        assetAppleId = assetApple.id

        const assetTesla = await prisma.asset.create({
            data: {
                symbol: "TSLA",
                name: "Tesla Inc.",
                lastPrice: new Prisma.Decimal(200), // 200€ par action
                todayPerformance: new Prisma.Decimal(0),
            },
        })
        assetTeslaId = assetTesla.id

        // Se connecter pour obtenir le token
        const loginResponse = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ email: "trader@test.com", password: "TestPassword123!" })
            .expect(201)

        authToken = loginResponse.body.accessToken
    })

    afterAll(async () => {
        await cleanDatabase()
        await prisma.$disconnect()
        await app.close()
    })

    describe("POST /portfolios/:id/buy", () => {
        it("devrait acheter un asset avec succès et mettre à jour toutes les valeurs", async () => {
            const buyDto = {
                assetId: assetAppleId,
                quantity: 10, // 10 actions × 150€ = 1500€
            }

            const response = await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(buyDto)
                .expect(201)

            // 🔍 VÉRIFICATION 1 : La transaction est créée
            expect(response.body).toMatchObject({
                portfolioId,
                assetId: assetAppleId,
                quantity: "10",
                price: "150",
                type: "buy",
            })
            expect(response.body.id).toBeDefined()

            // 🔍 VÉRIFICATION 2 : Le cash balance est correctement débité
            const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } })
            expect(portfolio).toBeDefined()
            expect(portfolio!.cashBalance.toString()).toBe("8500") // 10000 - 1500

            // 🔍 VÉRIFICATION 3 : Le portfolioAsset est créé avec les bonnes valeurs
            const portfolioAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetAppleId } },
            })
            expect(portfolioAsset).toBeDefined()
            expect(portfolioAsset!.quantity.toString()).toBe("10")
            expect(portfolioAsset!.averageBuyPrice.toString()).toBe("150")
            expect(portfolioAsset!.holdingValue.toString()).toBe("1500") // 10 × 150
            expect(portfolioAsset!.unrealizedPnl.toString()).toBe("0") // Acheté au prix actuel

            // 🔍 VÉRIFICATION 4 : Le holdingsValue du portfolio est mis à jour
            expect(portfolio!.holdingsValue.toString()).toBe("1500")

            // 🔍 VÉRIFICATION 5 : Le weight est calculé (100% car seul asset)
            expect(portfolioAsset!.weight.toString()).toBe("100")

            // 🔍 VÉRIFICATION 6 : Un snapshot est créé
            const snapshots = await prisma.portfolioSnapshots.findMany({
                where: { portfolioId },
            })
            expect(snapshots.length).toBe(1)
            // PortfolioSnapshots stocke cashBalance + holdingsValue séparément
            const totalValue = snapshots[0].cashBalance.add(snapshots[0].holdingsValue)
            expect(totalValue.toString()).toBe("10000") // 8500 cash + 1500 holdings
        })

        it("devrait acheter plus du même asset et recalculer le prix moyen", async () => {
            // On achète encore 5 actions Apple mais à un prix différent (simulé)
            // Prix actuel : 150€, on achète 5 actions = 750€
            // Prix moyen attendu : (10×150 + 5×150) / 15 = 150€ (même prix donc pas de changement)
            // Mais testons avec une modification de prix

            // Modifier le prix de l'asset pour simuler une fluctuation
            await prisma.asset.update({
                where: { id: assetAppleId },
                data: { lastPrice: new Prisma.Decimal(160) },
            })

            const buyDto = {
                assetId: assetAppleId,
                quantity: 5,
            }

            await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(buyDto)
                .expect(201)

            // 🔍 VÉRIFICATION : Prix moyen recalculé
            // (10×150 + 5×160) / 15 = (1500 + 800) / 15 = 2300/15 = 153.333...
            const portfolioAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetAppleId } },
            })
            expect(portfolioAsset).toBeDefined()
            expect(portfolioAsset!.quantity.toString()).toBe("15")
            expect(parseFloat(portfolioAsset!.averageBuyPrice.toString())).toBeCloseTo(153.33, 2)

            // 🔍 VÉRIFICATION : Quantité totale et holdingValue
            expect(portfolioAsset!.holdingValue.toString()).toBe("2400") // 15 × 160

            // 🔍 VÉRIFICATION : Cash balance
            const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } })
            expect(portfolio).toBeDefined()
            expect(portfolio!.cashBalance.toString()).toBe("7700") // 8500 - 800
        })

        it("devrait échouer si les fonds sont insuffisants", async () => {
            const buyDto = {
                assetId: assetTeslaId,
                quantity: 50, // 50 × 200 = 10000€ mais on a que 7700€
            }

            const response = await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(buyDto)
                .expect(400)

            expect(response.body.message).toContain("Fonds insuffisants")

            // 🔍 VÉRIFICATION ATOMICITÉ : Rien ne doit avoir changé en base
            const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } })
            expect(portfolio).toBeDefined()
            expect(portfolio!.cashBalance.toString()).toBe("7700") // Inchangé

            const portfolioAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetTeslaId } },
            })
            expect(portfolioAsset).toBeNull() // Pas créé
        })

        it("devrait échouer si l'asset n'existe pas", async () => {
            const buyDto = {
                assetId: 99999,
                quantity: 1,
            }

            const response = await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(buyDto)
                .expect(400)

            expect(response.body.message).toContain("n'existe pas")
        })
    })

    describe("POST /portfolios/:id/sell", () => {
        it("devrait vendre partiellement un asset et recalculer les valeurs", async () => {
            // On a 15 actions Apple, on en vend 5
            const sellDto = {
                assetId: assetAppleId,
                quantity: 5,
            }

            await request(app.getHttpServer())
                .post(`/transactions/sell`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(sellDto)
                .expect(201)

            // 🔍 VÉRIFICATION 1 : Cash balance augmenté
            const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } })
            expect(portfolio).toBeDefined()
            expect(portfolio!.cashBalance.toString()).toBe("8500") // 7700 + (5 × 160)

            // 🔍 VÉRIFICATION 2 : Quantité réduite
            const portfolioAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetAppleId } },
            })
            expect(portfolioAsset).toBeDefined()
            expect(portfolioAsset!.quantity.toString()).toBe("10")

            // 🔍 VÉRIFICATION 3 : HoldingValue recalculé
            expect(portfolioAsset!.holdingValue.toString()).toBe("1600") // 10 × 160

            // 🔍 VÉRIFICATION 4 : Portfolio holdings mis à jour
            expect(portfolio!.holdingsValue.toString()).toBe("1600")
        })

        it("devrait vendre totalement un asset et supprimer la ligne", async () => {
            // On vend les 10 actions restantes d'Apple
            const sellDto = {
                assetId: assetAppleId,
                quantity: 10,
            }

            await request(app.getHttpServer())
                .post(`/transactions/sell`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(sellDto)
                .expect(201)

            // 🔍 VÉRIFICATION 1 : PortfolioAsset supprimé
            const portfolioAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetAppleId } },
            })
            expect(portfolioAsset).toBeNull()

            // 🔍 VÉRIFICATION 2 : Cash balance augmenté
            const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } })
            expect(portfolio).toBeDefined()
            expect(portfolio!.cashBalance.toString()).toBe("10100") // 8500 + (10 × 160)

            // 🔍 VÉRIFICATION 3 : HoldingsValue à 0 (plus d'assets)
            expect(portfolio!.holdingsValue.toString()).toBe("0")
        })

        it("devrait échouer si on essaie de vendre un asset qu'on ne possède pas", async () => {
            const sellDto = {
                assetId: assetTeslaId,
                quantity: 1,
            }

            const response = await request(app.getHttpServer())
                .post(`/transactions/sell`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(sellDto)
                .expect(400)

            expect(response.body.message).toContain("ne possédez pas")
        })

        it("devrait échouer si la quantité à vendre est supérieure à la quantité possédée", async () => {
            // Acheter 5 Tesla d'abord
            await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ assetId: assetTeslaId, quantity: 5 })
                .expect(201)

            // Essayer de vendre 10 (on en a que 5)
            const sellDto = {
                assetId: assetTeslaId,
                quantity: 10,
            }

            const response = await request(app.getHttpServer())
                .post(`/transactions/sell`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(sellDto)
                .expect(400)

            expect(response.body.message).toContain("plus que ce que vous possédez")

            // 🔍 VÉRIFICATION ATOMICITÉ : La quantité n'a pas changé
            const portfolioAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetTeslaId } },
            })
            expect(portfolioAsset).toBeDefined()
            expect(portfolioAsset!.quantity.toString()).toBe("5")
        })
    })

    describe("GET /portfolios/:id/transactions", () => {
        it("devrait retourner l'historique des transactions avec pagination", async () => {
            const response = await request(app.getHttpServer())
                .get(`/transactions?page=1&limit=10`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200)

            expect(response.body.data).toBeDefined()
            expect(response.body.data.items).toBeInstanceOf(Array)
            expect(response.body.data.meta).toMatchObject({
                page: 1,
                total: expect.any(Number),
                lastPage: expect.any(Number),
            })

            // Vérifier qu'on a bien des transactions (buy + sell de nos tests précédents)
            expect(response.body.data.items.length).toBeGreaterThan(0)

            // Vérifier la structure d'une transaction
            const firstTransaction = response.body.data.items[0]
            expect(firstTransaction).toMatchObject({
                id: expect.any(Number),
                portfolioId,
                assetId: expect.any(Number),
                quantity: expect.any(String),
                price: expect.any(String),
                type: expect.stringMatching(/buy|sell/),
            })
            expect(firstTransaction.asset).toBeDefined()
        })
    })

    describe("Atomicité des transactions", () => {
        it("devrait rollback toutes les opérations en cas d'erreur pendant la transaction", async () => {
            // On va créer une situation où une erreur pourrait se produire
            // Pour cela, on va essayer d'acheter avec juste assez d'argent
            // mais si une opération échoue en cours de route, tout doit être rollback

            const portfolioBefore = await prisma.portfolio.findUnique({
                where: { id: portfolioId },
            })
            expect(portfolioBefore).toBeDefined()
            const cashBefore = portfolioBefore!.cashBalance.toString()
            const holdingsValueBefore = portfolioBefore!.holdingsValue.toString()

            // Essayer d'acheter un asset inexistant (va échouer)
            const buyDto = {
                assetId: 77777,
                quantity: 1,
            }

            await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(buyDto)
                .expect(400)

            // 🔍 VÉRIFICATION CRITIQUE : Rien ne doit avoir changé
            const portfolioAfter = await prisma.portfolio.findUnique({
                where: { id: portfolioId },
            })
            expect(portfolioAfter).toBeDefined()
            expect(portfolioAfter!.cashBalance.toString()).toBe(cashBefore)
            expect(portfolioAfter!.holdingsValue.toString()).toBe(holdingsValueBefore)

            // Vérifier qu'aucune transaction n'a été créée
            const transactions = await prisma.transaction.findMany({
                where: { portfolioId, assetId: 77777 },
            })
            expect(transactions.length).toBe(0)
        })
    })

    describe("Calculs de weights avec plusieurs assets", () => {
        it("devrait calculer correctement les weights quand on a plusieurs assets", async () => {
            // Reset : vendre tout Tesla si on en a
            const existingTesla = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetTeslaId } },
            })
            if (existingTesla) {
                await request(app.getHttpServer())
                    .post(`/transactions/sell`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .send({ assetId: assetTeslaId, quantity: existingTesla.quantity.toNumber() })
            }

            // Acheter Apple : 10 actions × 160€ = 1600€
            await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ assetId: assetAppleId, quantity: 10 })
                .expect(201)

            // Acheter Tesla : 5 actions × 200€ = 1000€
            await request(app.getHttpServer())
                .post(`/transactions/buy`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ assetId: assetTeslaId, quantity: 5 })
                .expect(201)

            // Total holdings : 1600 + 1000 = 2600€
            // Weight Apple : 1600/2600 × 100 = 61.54%
            // Weight Tesla : 1000/2600 × 100 = 38.46%

            const appleAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetAppleId } },
            })
            const teslaAsset = await prisma.portfolioAsset.findUnique({
                where: { portfolioId_assetId: { portfolioId, assetId: assetTeslaId } },
            })

            expect(appleAsset).toBeDefined()
            expect(teslaAsset).toBeDefined()

            // 🔍 VÉRIFICATION : Weights correctement calculés
            expect(parseFloat(appleAsset!.weight.toString())).toBeCloseTo(61.54, 1)
            expect(parseFloat(teslaAsset!.weight.toString())).toBeCloseTo(38.46, 1)

            // 🔍 VÉRIFICATION : Somme des weights = 100%
            const totalWeight = parseFloat(appleAsset!.weight.toString()) + parseFloat(teslaAsset!.weight.toString())
            expect(totalWeight).toBeCloseTo(100, 0)
        })
    })
})
