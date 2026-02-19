import { describe, it, expect, vi, beforeEach } from "vitest"
import {
    getPortfolio,
    getTransactions,
    getAssets,
    getAsset,
    getAssetPrices,
    getPortfolioAsset,
    getPortfolioAssets,
    getMarketStatus,
    processTradeExecution,
    forgotPassword,
    resetPassword,
    sendContactMessage,
    getFavorites,
    processAddFavorite,
    processRemoveFavorite,
} from "@/lib/api"
import { ASSET_PRICE_PERIOD, PORTFOLIO_PERFORMANCE_PERIOD, TransactionType } from "@/types/types"

// ─── Mock du fetcher ───────────────────────────────────────────────────────────

const mockFetcher = vi.fn()

vi.mock("@/lib/fetcher", () => ({
    fetcher: (...args: unknown[]) => mockFetcher(...args),
}))

// ─── Setup ─────────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL
const TOKEN = "test-access-token"

beforeEach(() => {
    mockFetcher.mockReset()
    mockFetcher.mockResolvedValue(undefined)
})

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("api.ts", () => {
    // ─── getPortfolio ──────────────────────────────────────────────────────────

    describe("getPortfolio", () => {
        it("appelle fetcher avec la bonne URL et le token", async () => {
            await getPortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/portfolio/1d`, TOKEN)
        })

        it("passe chaque période dans l'URL", async () => {
            await getPortfolio(PORTFOLIO_PERFORMANCE_PERIOD.MAX, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/portfolio/max`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getPortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/portfolio/1d`, undefined)
        })
    })

    // ─── getTransactions ───────────────────────────────────────────────────────

    describe("getTransactions", () => {
        it("appelle fetcher avec page et limit dans les query params", async () => {
            await getTransactions(1, 10, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/transactions?page=1&limit=10`, TOKEN)
        })

        it("gère des paramètres page/limit undefined", async () => {
            await getTransactions(undefined, undefined, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/transactions?page=undefined&limit=undefined`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getTransactions(1, 10)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/transactions?page=1&limit=10`, undefined)
        })
    })

    // ─── getAssets ─────────────────────────────────────────────────────────────

    describe("getAssets", () => {
        it("appelle fetcher avec la bonne URL et le token", async () => {
            await getAssets(TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getAssets()

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets`, undefined)
        })
    })

    // ─── getAsset ──────────────────────────────────────────────────────────────

    describe("getAsset", () => {
        it("appelle fetcher avec le symbole dans l'URL", async () => {
            await getAsset("AAPL", TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets/AAPL`, TOKEN)
        })

        it("gère différents symboles", async () => {
            await getAsset("MSFT", TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets/MSFT`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getAsset("AAPL")

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets/AAPL`, undefined)
        })
    })

    // ─── getAssetPrices ────────────────────────────────────────────────────────

    describe("getAssetPrices", () => {
        it("appelle fetcher avec le symbole et la période dans l'URL", async () => {
            await getAssetPrices("AAPL", ASSET_PRICE_PERIOD.ONE_DAY, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets-price/AAPL/1d`, TOKEN)
        })

        it("gère chaque période", async () => {
            await getAssetPrices("GOOGL", ASSET_PRICE_PERIOD.FIVE_YEARS, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets-price/GOOGL/5y`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getAssetPrices("AAPL", ASSET_PRICE_PERIOD.ONE_MONTH)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/assets-price/AAPL/1m`, undefined)
        })
    })

    // ─── getPortfolioAsset ─────────────────────────────────────────────────────

    describe("getPortfolioAsset", () => {
        it("appelle fetcher avec le symbole dans l'URL", async () => {
            await getPortfolioAsset("TSLA", TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/portfolios-assets/TSLA`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getPortfolioAsset("TSLA")

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/portfolios-assets/TSLA`, undefined)
        })
    })

    // ─── getPortfolioAssets ────────────────────────────────────────────────────

    describe("getPortfolioAssets", () => {
        it("appelle fetcher avec la bonne URL et le token", async () => {
            await getPortfolioAssets(TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/portfolios-assets`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getPortfolioAssets()

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/portfolios-assets`, undefined)
        })
    })

    // ─── getMarketStatus ───────────────────────────────────────────────────────

    describe("getMarketStatus", () => {
        it("appelle fetcher avec la bonne URL et le token", async () => {
            await getMarketStatus(TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/market-status`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getMarketStatus()

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/market-status`, undefined)
        })
    })

    // ─── processTradeExecution ─────────────────────────────────────────────────

    describe("processTradeExecution", () => {
        it("appelle fetcher en POST avec le type de transaction dans l'URL", async () => {
            await processTradeExecution(TransactionType.BUY, 42, 10, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/transactions/buy`, TOKEN, {
                method: "POST",
                body: JSON.stringify({ assetId: 42, quantity: 10 }),
            })
        })

        it("fonctionne avec le type SELL", async () => {
            await processTradeExecution(TransactionType.SELL, 7, 5, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/transactions/sell`, TOKEN, {
                method: "POST",
                body: JSON.stringify({ assetId: 7, quantity: 5 }),
            })
        })

        it("fonctionne sans token", async () => {
            await processTradeExecution(TransactionType.BUY, 1, 1)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/transactions/buy`, undefined, {
                method: "POST",
                body: JSON.stringify({ assetId: 1, quantity: 1 }),
            })
        })

        it("sérialise correctement assetId et quantity dans le body", async () => {
            await processTradeExecution(TransactionType.BUY, 123, 0.5, TOKEN)

            const callArgs = mockFetcher.mock.calls[0]
            const body = JSON.parse(callArgs[2].body as string)

            expect(body).toEqual({ assetId: 123, quantity: 0.5 })
        })
    })

    // ─── forgotPassword ────────────────────────────────────────────────────────

    describe("forgotPassword", () => {
        it("appelle fetcher en POST sans token avec l'email dans le body", async () => {
            await forgotPassword("user@example.com")

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/auth/forgot-password`, undefined, {
                method: "POST",
                body: JSON.stringify({ email: "user@example.com" }),
            })
        })
    })

    // ─── resetPassword ─────────────────────────────────────────────────────────

    describe("resetPassword", () => {
        it("appelle fetcher en POST sans token avec le token de reset et le nouveau mot de passe", async () => {
            await resetPassword("reset-token-123", "newPassword456")

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/auth/reset-password`, undefined, {
                method: "POST",
                body: JSON.stringify({ token: "reset-token-123", newPassword: "newPassword456" }),
            })
        })
    })

    // ─── sendContactMessage ────────────────────────────────────────────────────

    describe("sendContactMessage", () => {
        it("appelle fetcher en POST sans token avec toutes les données du formulaire", async () => {
            const contactData = {
                firstName: "Jean",
                lastName: "Dupont",
                email: "jean@example.com",
                subject: "Question",
                message: "Bonjour, j'ai une question.",
            }

            await sendContactMessage(contactData)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/email/contact`, undefined, {
                method: "POST",
                body: JSON.stringify(contactData),
            })
        })
    })

    // ─── getFavorites ──────────────────────────────────────────────────────────

    describe("getFavorites", () => {
        it("appelle fetcher avec la bonne URL et le token", async () => {
            await getFavorites(TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/favorites`, TOKEN)
        })

        it("fonctionne sans token", async () => {
            await getFavorites()

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/favorites`, undefined)
        })
    })

    // ─── processAddFavorite ────────────────────────────────────────────────────

    describe("processAddFavorite", () => {
        it("appelle fetcher en POST avec l'assetId dans le body", async () => {
            await processAddFavorite(42, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/favorites`, TOKEN, {
                method: "POST",
                body: JSON.stringify({ assetId: 42 }),
            })
        })

        it("fonctionne sans token", async () => {
            await processAddFavorite(10)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/favorites`, undefined, {
                method: "POST",
                body: JSON.stringify({ assetId: 10 }),
            })
        })

        it("sérialise correctement l'assetId dans le body", async () => {
            await processAddFavorite(123, TOKEN)

            const callArgs = mockFetcher.mock.calls[0]
            const body = JSON.parse(callArgs[2].body as string)

            expect(body).toEqual({ assetId: 123 })
        })
    })

    // ─── processRemoveFavorite ─────────────────────────────────────────────────

    describe("processRemoveFavorite", () => {
        it("appelle fetcher en DELETE avec l'assetId dans le body", async () => {
            await processRemoveFavorite(42, TOKEN)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/favorites`, TOKEN, {
                method: "DELETE",
                body: JSON.stringify({ assetId: 42 }),
            })
        })

        it("fonctionne sans token", async () => {
            await processRemoveFavorite(10)

            expect(mockFetcher).toHaveBeenCalledWith(`${API_URL}/favorites`, undefined, {
                method: "DELETE",
                body: JSON.stringify({ assetId: 10 }),
            })
        })

        it("sérialise correctement l'assetId dans le body", async () => {
            await processRemoveFavorite(99, TOKEN)

            const callArgs = mockFetcher.mock.calls[0]
            const body = JSON.parse(callArgs[2].body as string)

            expect(body).toEqual({ assetId: 99 })
        })
    })

    // ─── Retour de valeurs ─────────────────────────────────────────────────────

    describe("retour de valeurs", () => {
        it("retourne la valeur résolue par le fetcher", async () => {
            const mockPortfolio = { cashBalance: 10000, holdingsValue: 5000 }
            mockFetcher.mockResolvedValue(mockPortfolio)

            const result = await getPortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, TOKEN)

            expect(result).toEqual(mockPortfolio)
        })

        it("propage les erreurs du fetcher", async () => {
            mockFetcher.mockRejectedValue(new Error("Network error"))

            await expect(getAssets(TOKEN)).rejects.toThrow("Network error")
        })
    })
})
