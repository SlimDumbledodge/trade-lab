import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetcher } from "@/lib/fetcher"

// Mock du logger pour éviter le bruit dans les tests
vi.mock("@/lib/logger", () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}))

// Helper pour créer une Response mockée
function mockResponse(body: unknown, init: { status?: number; statusText?: string; ok?: boolean } = {}): Response {
    const { status = 200, statusText = "OK" } = init
    return {
        ok: init.ok ?? (status >= 200 && status < 300),
        status,
        statusText,
        json: () => Promise.resolve(body),
        headers: new Headers(),
        redirected: false,
        type: "basic" as ResponseType,
        url: "",
        clone: vi.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
        text: vi.fn(),
        bytes: vi.fn(),
    } as unknown as Response
}

describe("fetcher", () => {
    const originalFetch = globalThis.fetch
    const originalWindow = globalThis.window

    beforeEach(() => {
        globalThis.fetch = vi.fn()
        // Simule un environnement navigateur avec window.location modifiable
        Object.defineProperty(globalThis, "window", {
            value: { location: { href: "" } },
            writable: true,
            configurable: true,
        })
    })

    afterEach(() => {
        globalThis.fetch = originalFetch
        Object.defineProperty(globalThis, "window", {
            value: originalWindow,
            writable: true,
            configurable: true,
        })
        vi.restoreAllMocks()
    })

    // ─── Headers ───────────────────────────────────────────────────────

    describe("headers", () => {
        it("envoie Content-Type application/json par défaut", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ value: 1 }))

            await fetcher("https://api.test/data")

            expect(globalThis.fetch).toHaveBeenCalledWith("https://api.test/data", {
                headers: {
                    "Content-Type": "application/json",
                },
            })
        })

        it("ajoute le header Authorization quand un token est fourni", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ value: 1 }))

            await fetcher("https://api.test/data", "my-jwt-token")

            expect(globalThis.fetch).toHaveBeenCalledWith("https://api.test/data", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer my-jwt-token",
                },
            })
        })

        it("n'ajoute pas Authorization quand le token est undefined", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ value: 1 }))

            await fetcher("https://api.test/data", undefined)

            const callHeaders = vi.mocked(globalThis.fetch).mock.calls[0][1]?.headers as Record<string, string>
            expect(callHeaders).not.toHaveProperty("Authorization")
        })

        it("merge les headers custom avec les headers par défaut", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ value: 1 }))

            await fetcher("https://api.test/data", "token", {
                headers: { "X-Custom": "custom-value" },
            })

            expect(globalThis.fetch).toHaveBeenCalledWith("https://api.test/data", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer token",
                    "X-Custom": "custom-value",
                },
            })
        })

        it("permet d'écraser Content-Type via les options", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ value: 1 }))

            await fetcher("https://api.test/data", undefined, {
                headers: { "Content-Type": "text/plain" },
            })

            const callHeaders = vi.mocked(globalThis.fetch).mock.calls[0][1]?.headers as Record<string, string>
            expect(callHeaders["Content-Type"]).toBe("text/plain")
        })
    })

    // ─── Options de requête ────────────────────────────────────────────

    describe("options de requête", () => {
        it("transmet les options RequestInit (method, body, etc.)", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ id: 1 }))

            await fetcher("https://api.test/data", undefined, {
                method: "POST",
                body: JSON.stringify({ name: "test" }),
            })

            expect(globalThis.fetch).toHaveBeenCalledWith("https://api.test/data", {
                method: "POST",
                body: JSON.stringify({ name: "test" }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
        })
    })

    // ─── Parsing de la réponse ─────────────────────────────────────────

    describe("parsing de la réponse", () => {
        it("retourne json.data quand la réponse contient un champ data", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ data: { id: 1, name: "Apple" } }))

            const result = await fetcher<{ id: number; name: string }>("https://api.test/asset")

            expect(result).toEqual({ id: 1, name: "Apple" })
        })

        it("retourne le JSON complet quand il n'y a pas de champ data", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ id: 1, name: "Apple" }))

            const result = await fetcher<{ id: number; name: string }>("https://api.test/asset")

            expect(result).toEqual({ id: 1, name: "Apple" })
        })

        it("retourne json.data même si data est null", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ data: null }))

            const result = await fetcher("https://api.test/empty")

            // data est null → null ?? { data: null } → la réponse complète est retournée
            expect(result).toEqual({ data: null })
        })

        it("retourne json.data quand data est un tableau", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ data: [1, 2, 3] }))

            const result = await fetcher<number[]>("https://api.test/list")

            expect(result).toEqual([1, 2, 3])
        })

        it("retourne json.data quand data est une string vide (nullish coalescing)", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({ data: "" }))

            const result = await fetcher("https://api.test/empty")

            // ?? ne check que null/undefined, pas les falsy → "" est retourné
            expect(result).toBe("")
        })
    })

    // ─── Gestion du 401 ────────────────────────────────────────────────

    describe("gestion du 401 (Unauthorized)", () => {
        it("redirige vers /login quand window existe", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(
                mockResponse({}, { status: 401, statusText: "Unauthorized", ok: false }),
            )

            await expect(fetcher("https://api.test/protected")).rejects.toThrow("Unauthorized")

            expect(globalThis.window.location.href).toBe("/login")
        })

        it("throw une erreur 'Unauthorized' sur un 401", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(
                mockResponse({}, { status: 401, statusText: "Unauthorized", ok: false }),
            )

            await expect(fetcher("https://api.test/protected")).rejects.toThrow("Unauthorized")
        })

        it("ne redirige pas quand window n'existe pas (SSR)", async () => {
            // Supprime window pour simuler un environnement serveur
            Object.defineProperty(globalThis, "window", {
                value: undefined,
                writable: true,
                configurable: true,
            })

            vi.mocked(globalThis.fetch).mockResolvedValue(
                mockResponse({}, { status: 401, statusText: "Unauthorized", ok: false }),
            )

            await expect(fetcher("https://api.test/protected")).rejects.toThrow("Unauthorized")
            // Pas de crash même sans window
        })
    })

    // ─── Erreurs HTTP (non-401) ────────────────────────────────────────

    describe("erreurs HTTP (non-401)", () => {
        it("throw une erreur avec le status et statusText pour un 404", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({}, { status: 404, statusText: "Not Found", ok: false }))

            await expect(fetcher("https://api.test/missing")).rejects.toThrow("HTTP 404: Not Found")
        })

        it("throw une erreur pour un 500", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(
                mockResponse({}, { status: 500, statusText: "Internal Server Error", ok: false }),
            )

            await expect(fetcher("https://api.test/broken")).rejects.toThrow("HTTP 500: Internal Server Error")
        })

        it("throw une erreur pour un 403", async () => {
            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse({}, { status: 403, statusText: "Forbidden", ok: false }))

            await expect(fetcher("https://api.test/forbidden")).rejects.toThrow("HTTP 403: Forbidden")
        })
    })

    // ─── Erreurs réseau ────────────────────────────────────────────────

    describe("erreurs réseau", () => {
        it("propage une erreur réseau (fetch échoue)", async () => {
            vi.mocked(globalThis.fetch).mockRejectedValue(new TypeError("Failed to fetch"))

            await expect(fetcher("https://api.test/down")).rejects.toThrow("Failed to fetch")
        })

        it("propage une erreur si json() échoue", async () => {
            const badResponse = mockResponse({})
            badResponse.json = vi.fn().mockRejectedValue(new SyntaxError("Unexpected token"))

            vi.mocked(globalThis.fetch).mockResolvedValue(badResponse)

            await expect(fetcher("https://api.test/bad-json")).rejects.toThrow("Unexpected token")
        })
    })

    // ─── Logging ───────────────────────────────────────────────────────

    describe("logging", () => {
        it("appelle logger.warn sur un 401", async () => {
            const { logger } = await import("@/lib/logger")

            vi.mocked(globalThis.fetch).mockResolvedValue(
                mockResponse({}, { status: 401, statusText: "Unauthorized", ok: false }),
            )

            await expect(fetcher("https://api.test/auth")).rejects.toThrow()

            expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempt", {
                url: "https://api.test/auth",
            })
        })

        it("appelle logger.error sur une erreur HTTP non-401", async () => {
            const { logger } = await import("@/lib/logger")

            vi.mocked(globalThis.fetch).mockResolvedValue(
                mockResponse({}, { status: 500, statusText: "Internal Server Error", ok: false }),
            )

            await expect(fetcher("https://api.test/error")).rejects.toThrow()

            expect(logger.error).toHaveBeenCalledWith("API request failed", {
                url: "https://api.test/error",
                status: 500,
                message: "HTTP 500: Internal Server Error",
            })
        })

        it("appelle logger.error dans le catch pour toute erreur", async () => {
            const { logger } = await import("@/lib/logger")

            const error = new TypeError("Network error")
            vi.mocked(globalThis.fetch).mockRejectedValue(error)

            await expect(fetcher("https://api.test/crash")).rejects.toThrow()

            expect(logger.error).toHaveBeenCalledWith("Fetcher error", {
                url: "https://api.test/crash",
                error,
            })
        })
    })
})
