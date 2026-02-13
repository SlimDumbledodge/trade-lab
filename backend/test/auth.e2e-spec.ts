import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import * as request from "supertest"
import { App } from "supertest/types"
import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"

describe("Auth E2E Tests", () => {
    let app: INestApplication<App>
    let prismaService: PrismaService

    // Données de test
    const testUser = {
        username: "testuser",
        email: "test@example.com",
        password: "TestPassword123!",
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
        await app.init()

        prismaService = moduleFixture.get<PrismaService>(PrismaService)

        // Nettoyer la base de données avant les tests
        await cleanDatabase()
    })

    afterAll(async () => {
        // Nettoyer après les tests
        await cleanDatabase()
        await app.close()
    })

    // Helper pour nettoyer la base de données
    async function cleanDatabase() {
        await prismaService.transaction.deleteMany({})
        await prismaService.portfolioAsset.deleteMany({})
        await prismaService.portfolioSnapshots.deleteMany({})
        await prismaService.portfolio.deleteMany({})
        await prismaService.user.deleteMany({})
    }

    // Helper pour créer un utilisateur
    async function createTestUser() {
        const hashedPassword = await bcrypt.hash(testUser.password, 10)
        return await prismaService.user.create({
            data: {
                username: testUser.username,
                email: testUser.email,
                passwordHash: hashedPassword,
                portfolio: {
                    create: {},
                },
            },
            include: {
                portfolio: true,
            },
        })
    }

    describe("POST /auth/login", () => {
        beforeEach(async () => {
            await cleanDatabase()
            await createTestUser()
        })

        it("devrait permettre de se connecter avec des identifiants valides", async () => {
            const response = await request(app.getHttpServer())
                .post("/auth/login")
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(201)

            expect(response.body).toHaveProperty("accessToken")
            expect(response.body.accessToken).toBeDefined()
            expect(typeof response.body.accessToken).toBe("string")
            expect(response.body).toHaveProperty("user")
            expect(response.body.user.email).toBe(testUser.email)
            expect(response.body.user).toHaveProperty("portfolioId")
        })

        it("devrait retourner 404 si l'email n'existe pas", async () => {
            const response = await request(app.getHttpServer())
                .post("/auth/login")
                .send({
                    email: "inexistant@example.com",
                    password: testUser.password,
                })
                .expect(404)

            expect(response.body.message).toContain("No user found for email")
        })

        it("devrait retourner 401 si le mot de passe est incorrect", async () => {
            const response = await request(app.getHttpServer())
                .post("/auth/login")
                .send({
                    email: testUser.email,
                    password: "WrongPassword123!",
                })
                .expect(401)

            expect(response.body.message).toBe("Invalid password")
        })

        it("devrait retourner 400 si l'email est manquant", async () => {
            await request(app.getHttpServer())
                .post("/auth/login")
                .send({
                    password: testUser.password,
                })
                .expect(400)
        })

        it("devrait retourner 400 si le mot de passe est manquant", async () => {
            await request(app.getHttpServer())
                .post("/auth/login")
                .send({
                    email: testUser.email,
                })
                .expect(400)
        })
    })

    describe("POST /auth/forgot-password", () => {
        beforeEach(async () => {
            await cleanDatabase()
            await createTestUser()
        })

        // Skip en CI car nécessite un serveur SMTP
        it.skip("devrait retourner un message de succès si l'email existe", async () => {
            const response = await request(app.getHttpServer())
                .post("/auth/forgot-password")
                .send({
                    email: testUser.email,
                })
                .expect(201)

            expect(response.body.message).toBe("Si cet email existe, un lien de réinitialisation a été envoyé.")
        })

        it("devrait retourner le même message si l'email n'existe pas (sécurité)", async () => {
            const response = await request(app.getHttpServer())
                .post("/auth/forgot-password")
                .send({
                    email: "inexistant@example.com",
                })
                .expect(201)

            expect(response.body.message).toBe("Si cet email existe, un lien de réinitialisation a été envoyé.")
        })

        it("devrait retourner 400 si l'email est manquant", async () => {
            await request(app.getHttpServer()).post("/auth/forgot-password").send({}).expect(400)
        })
    })

    describe("POST /auth/reset-password", () => {
        beforeEach(async () => {
            await cleanDatabase()
        })

        it("devrait permettre de réinitialiser le mot de passe avec un token valide", async () => {
            // Créer un utilisateur avec un token de réinitialisation
            const plainToken = crypto.randomBytes(32).toString("hex")
            const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex")

            await prismaService.user.create({
                data: {
                    username: testUser.username,
                    email: testUser.email,
                    passwordHash: await bcrypt.hash(testUser.password, 10),
                    resetPasswordToken: hashedToken,
                    resetPasswordExpires: new Date(Date.now() + 3600000), // 1h dans le futur
                    portfolio: {
                        create: {},
                    },
                },
            })

            const newPassword = "NewPassword123!"

            const response = await request(app.getHttpServer())
                .post("/auth/reset-password")
                .send({
                    token: plainToken,
                    newPassword: newPassword,
                })
                .expect(201)

            expect(response.body.message).toBe("Mot de passe réinitialisé avec succès")

            // Vérifier que le token a été supprimé en base
            const updatedUser = await prismaService.user.findUnique({
                where: { email: testUser.email },
            })
            expect(updatedUser?.resetPasswordToken).toBeNull()
            expect(updatedUser?.resetPasswordExpires).toBeNull()
        })

        it("devrait retourner 400 avec un token invalide", async () => {
            const response = await request(app.getHttpServer())
                .post("/auth/reset-password")
                .send({
                    token: "invalid-token-123",
                    newPassword: "NewPassword123!",
                })
                .expect(400)

            expect(response.body.message).toBe("Token invalide ou expiré")
        })

        it("devrait retourner 400 avec un token expiré", async () => {
            // Créer un utilisateur avec un token expiré
            const plainToken = crypto.randomBytes(32).toString("hex")
            const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex")

            await prismaService.user.create({
                data: {
                    username: testUser.username,
                    email: testUser.email,
                    passwordHash: await bcrypt.hash(testUser.password, 10),
                    resetPasswordToken: hashedToken,
                    resetPasswordExpires: new Date(Date.now() - 3600000), // 1h dans le passé
                    portfolio: {
                        create: {},
                    },
                },
            })

            const response = await request(app.getHttpServer())
                .post("/auth/reset-password")
                .send({
                    token: plainToken,
                    newPassword: "NewPassword123!",
                })
                .expect(400)

            expect(response.body.message).toBe("Token invalide ou expiré")
        })

        it("devrait retourner 400 si le token est manquant", async () => {
            await request(app.getHttpServer())
                .post("/auth/reset-password")
                .send({
                    newPassword: "NewPassword123!",
                })
                .expect(400)
        })

        it("devrait retourner 400 si le nouveau mot de passe est manquant", async () => {
            await request(app.getHttpServer())
                .post("/auth/reset-password")
                .send({
                    token: "some-token",
                })
                .expect(400)
        })
    })

    describe("Protected Routes", () => {
        let _accessToken: string

        beforeEach(async () => {
            await cleanDatabase()
            await createTestUser()

            // Se connecter pour obtenir un token
            const loginResponse = await request(app.getHttpServer()).post("/auth/login").send({
                email: testUser.email,
                password: testUser.password,
            })

            _accessToken = loginResponse.body.accessToken
        })

        it("devrait bloquer l'accès à /portfolio sans token", async () => {
            await request(app.getHttpServer()).get("/portfolio/1d").expect(401)
        })

        it("devrait bloquer l'accès avec un token invalide", async () => {
            await request(app.getHttpServer()).get("/portfolio/1d").set("Authorization", "Bearer invalid-token-xyz").expect(401)
        })
    })
})
