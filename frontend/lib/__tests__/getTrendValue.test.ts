import { describe, it, expect } from "vitest"
import { getTrendValue } from "@/lib/utils"
import type { PortfolioAsset } from "@/types/types"

const mockAsset = (overrides?: Partial<PortfolioAsset>): PortfolioAsset => ({
    id: 1,
    portfolioId: 1,
    assetId: 1,
    quantity: 10,
    averageBuyPrice: 100,
    holdingValue: 1200,
    weight: 0.5,
    unrealizedPnl: 200,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    asset: {
        id: 1,
        symbol: "AAPL",
        name: "Apple Inc.",
        lastPrice: "150",
        midPrice: "149.5",
        bidPrice: "149",
        askPrice: "150",
        quoteTimestamp: "2025-01-01T00:00:00Z",
        quoteVolume: "1000000",
        todayPerformance: "2.5",
        logo: "/logo.png",
        category: "tech",
        updatedAt: "2025-01-01T00:00:00Z",
    },
    ...overrides,
})

describe("getTrendValue", () => {
    describe("daily_pct", () => {
        it("retourne la performance du jour en %", () => {
            const result = getTrendValue(mockAsset(), "daily_pct")

            expect(result).toEqual({ value: 2.5, unit: "%" })
        })

        it("gère une performance négative", () => {
            const asset = mockAsset({ asset: { ...mockAsset().asset, todayPerformance: "-3.2" } })
            const result = getTrendValue(asset, "daily_pct")

            expect(result).toEqual({ value: -3.2, unit: "%" })
        })

        it("gère une performance à zéro", () => {
            const asset = mockAsset({ asset: { ...mockAsset().asset, todayPerformance: "0" } })
            const result = getTrendValue(asset, "daily_pct")

            expect(result).toEqual({ value: 0, unit: "%" })
        })
    })

    describe("daily_eur", () => {
        it("calcule le PnL quotidien en € (lastPrice × todayPerformance/100 × quantity)", () => {
            // 150 * (2.5 / 100) * 10 = 37.5
            const result = getTrendValue(mockAsset(), "daily_eur")

            expect(result.unit).toBe("€")
            expect(result.value).toBeCloseTo(37.5)
        })

        it("gère une performance négative", () => {
            const asset = mockAsset({ asset: { ...mockAsset().asset, todayPerformance: "-1", lastPrice: "200" } })
            // 200 * (-1 / 100) * 10 = -20
            const result = getTrendValue(asset, "daily_eur")

            expect(result.unit).toBe("€")
            expect(result.value).toBeCloseTo(-20)
        })

        it("retourne 0 si la performance est 0", () => {
            const asset = mockAsset({ asset: { ...mockAsset().asset, todayPerformance: "0" } })
            const result = getTrendValue(asset, "daily_eur")

            expect(result).toEqual({ value: 0, unit: "€" })
        })
    })

    describe("since_buy_pct", () => {
        it("calcule le PnL depuis l'achat en % (unrealizedPnl / (averageBuyPrice × quantity) × 100)", () => {
            // 200 / (100 * 10) * 100 = 20%
            const result = getTrendValue(mockAsset(), "since_buy_pct")

            expect(result.unit).toBe("%")
            expect(result.value).toBeCloseTo(20)
        })

        it("gère un PnL négatif", () => {
            const asset = mockAsset({ unrealizedPnl: -50 })
            // -50 / (100 * 10) * 100 = -5%
            const result = getTrendValue(asset, "since_buy_pct")

            expect(result.unit).toBe("%")
            expect(result.value).toBeCloseTo(-5)
        })

        it("retourne 0% si le montant investi est 0 (division par zéro)", () => {
            const asset = mockAsset({ averageBuyPrice: 0, quantity: 0 })
            const result = getTrendValue(asset, "since_buy_pct")

            expect(result).toEqual({ value: 0, unit: "%" })
        })
    })

    describe("since_buy_eur", () => {
        it("retourne le unrealizedPnl en €", () => {
            const result = getTrendValue(mockAsset(), "since_buy_eur")

            expect(result).toEqual({ value: 200, unit: "€" })
        })

        it("gère un PnL négatif", () => {
            const asset = mockAsset({ unrealizedPnl: -150 })
            const result = getTrendValue(asset, "since_buy_eur")

            expect(result).toEqual({ value: -150, unit: "€" })
        })

        it("gère un PnL à zéro", () => {
            const asset = mockAsset({ unrealizedPnl: 0 })
            const result = getTrendValue(asset, "since_buy_eur")

            expect(result).toEqual({ value: 0, unit: "€" })
        })
    })
})
