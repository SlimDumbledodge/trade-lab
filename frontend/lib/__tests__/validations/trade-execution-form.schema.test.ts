import { describe, it, expect } from "vitest"
import { createTradeFormSchema } from "@/lib/validations/trade-execution-form.schema"
import { TransactionType } from "@/types/types"

// Reproduit l'enum FormMode de TradeExecutionForm.tsx pour éviter d'importer
// un composant React avec des dépendances lourdes (next-auth, next/navigation, etc.)
enum FormMode {
    MONTANT = 0,
    AUMARCHE = 1,
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const parseWithSchema = (
    transactionType: TransactionType,
    formMode: FormMode,
    cashBalance: number,
    lastPrice: number,
    portfolioAssetQuantity: number,
    data: Record<string, unknown>,
) => {
    const schema = createTradeFormSchema(transactionType, formMode, cashBalance, lastPrice, portfolioAssetQuantity)
    return schema.safeParse(data)
}

const findIssue = (
    result: { success: false; error: { issues: Array<{ path: (string | number)[]; message: string }> } },
    field: string,
) => {
    return result.error.issues.find((i) => i.path.includes(field))
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("createTradeFormSchema", () => {
    // ─── Mode MONTANT / BUY ────────────────────────────────────────────────────

    describe("mode MONTANT + BUY", () => {
        const parse = (data: Record<string, unknown>, cashBalance = 10000, lastPrice = 150) =>
            parseWithSchema(TransactionType.BUY, FormMode.MONTANT, cashBalance, lastPrice, 0, data)

        it("accepte un montant valide inférieur au solde", () => {
            const result = parse({ montant: "5000" })

            expect(result.success).toBe(true)
        })

        it("accepte un montant égal au solde", () => {
            const result = parse({ montant: "10000" })

            expect(result.success).toBe(true)
        })

        it("rejette un montant supérieur au solde", () => {
            const result = parse({ montant: "15000" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "montant")
                expect(issue?.message).toBe("Montant supérieur au solde disponible")
            }
        })

        it("rejette un montant de 0", () => {
            const result = parse({ montant: "0" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "montant")
                expect(issue).toBeDefined()
            }
        })

        it("rejette un montant négatif", () => {
            const result = parse({ montant: "-100" })

            expect(result.success).toBe(false)
        })

        it("rejette un montant vide", () => {
            const result = parse({ montant: "" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "montant")
                expect(issue?.message).toBe("Veuillez saisir un montant valide supérieur à 0")
            }
        })

        it("rejette si montant est undefined", () => {
            const result = parse({})

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "montant")
                expect(issue?.message).toBe("Veuillez saisir un montant valide supérieur à 0")
            }
        })

        it("rejette un montant non numérique", () => {
            const result = parse({ montant: "abc" })

            expect(result.success).toBe(false)
        })
    })

    // ─── Mode MONTANT / SELL ───────────────────────────────────────────────────

    describe("mode MONTANT + SELL", () => {
        // cashBalance=10000, lastPrice=100, portfolioAssetQuantity=50 → valeur max vente = 5000
        const parse = (data: Record<string, unknown>, cashBalance = 10000, lastPrice = 100, qty = 50) =>
            parseWithSchema(TransactionType.SELL, FormMode.MONTANT, cashBalance, lastPrice, qty, data)

        it("accepte un montant valide inférieur à la valeur des actions détenues", () => {
            // 50 actions × 100€ = 5000€ max
            const result = parse({ montant: "3000" })

            expect(result.success).toBe(true)
        })

        it("accepte un montant égal à la valeur totale des actions", () => {
            const result = parse({ montant: "5000" })

            expect(result.success).toBe(true)
        })

        it("rejette un montant supérieur à la valeur des actions disponibles", () => {
            const result = parse({ montant: "6000" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "montant")
                expect(issue?.message).toBe("Montant supérieur à la valeur de vos actions disponibles")
            }
        })

        it("rejette un montant de 0", () => {
            const result = parse({ montant: "0" })

            expect(result.success).toBe(false)
        })

        it("rejette un montant vide", () => {
            const result = parse({ montant: "" })

            expect(result.success).toBe(false)
        })
    })

    // ─── Mode AUMARCHE (nb actions) / BUY ──────────────────────────────────────

    describe("mode AUMARCHE + BUY", () => {
        // cashBalance=10000, lastPrice=100 → max 100 actions
        const parse = (data: Record<string, unknown>, cashBalance = 10000, lastPrice = 100) =>
            parseWithSchema(TransactionType.BUY, FormMode.AUMARCHE, cashBalance, lastPrice, 0, data)

        it("accepte un nombre d'actions valide dont le coût total est inférieur au solde", () => {
            // 50 actions × 100€ = 5000€ < 10000€
            const result = parse({ nbActions: "50" })

            expect(result.success).toBe(true)
        })

        it("accepte un nombre d'actions dont le coût total est égal au solde", () => {
            // 100 actions × 100€ = 10000€
            const result = parse({ nbActions: "100" })

            expect(result.success).toBe(true)
        })

        it("rejette un nombre d'actions dont le coût total dépasse le solde", () => {
            // 101 actions × 100€ = 10100€ > 10000€
            const result = parse({ nbActions: "101" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "nbActions")
                expect(issue?.message).toBe("Montant total supérieur au solde disponible")
            }
        })

        it("rejette un nombre d'actions de 0", () => {
            const result = parse({ nbActions: "0" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "nbActions")
                expect(issue).toBeDefined()
            }
        })

        it("rejette un nombre d'actions négatif", () => {
            const result = parse({ nbActions: "-5" })

            expect(result.success).toBe(false)
        })

        it("rejette un nombre d'actions vide", () => {
            const result = parse({ nbActions: "" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "nbActions")
                expect(issue?.message).toBe("Veuillez saisir un nombre d'actions valide supérieur à 0")
            }
        })

        it("rejette si nbActions est undefined", () => {
            const result = parse({})

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "nbActions")
                expect(issue?.message).toBe("Veuillez saisir un nombre d'actions valide supérieur à 0")
            }
        })

        it("rejette un nombre d'actions non numérique", () => {
            const result = parse({ nbActions: "abc" })

            expect(result.success).toBe(false)
        })
    })

    // ─── Mode AUMARCHE (nb actions) / SELL ─────────────────────────────────────

    describe("mode AUMARCHE + SELL", () => {
        // cashBalance=10000, lastPrice=100, portfolioAssetQuantity=50
        const parse = (data: Record<string, unknown>, cashBalance = 10000, lastPrice = 100, qty = 50) =>
            parseWithSchema(TransactionType.SELL, FormMode.AUMARCHE, cashBalance, lastPrice, qty, data)

        it("accepte un nombre d'actions inférieur à la quantité détenue", () => {
            const result = parse({ nbActions: "30" })

            expect(result.success).toBe(true)
        })

        it("accepte un nombre d'actions égal à la quantité détenue", () => {
            const result = parse({ nbActions: "50" })

            expect(result.success).toBe(true)
        })

        it("rejette un nombre d'actions supérieur à la quantité détenue", () => {
            const result = parse({ nbActions: "51" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "nbActions")
                expect(issue?.message).toBe("Nombre d'actions supérieur à vos actions disponibles")
            }
        })

        it("rejette un nombre d'actions de 0", () => {
            const result = parse({ nbActions: "0" })

            expect(result.success).toBe(false)
        })
    })

    // ─── Cas limites ───────────────────────────────────────────────────────────

    describe("cas limites", () => {
        it("mode MONTANT n'échoue pas sur le champ nbActions (non pertinent)", () => {
            // En mode MONTANT, seul le champ montant est validé par superRefine
            const result = parseWithSchema(TransactionType.BUY, FormMode.MONTANT, 10000, 100, 0, { montant: "500" })

            expect(result.success).toBe(true)
        })

        it("mode AUMARCHE n'échoue pas sur le champ montant (non pertinent)", () => {
            // En mode AUMARCHE, seul le champ nbActions est validé par superRefine
            const result = parseWithSchema(TransactionType.BUY, FormMode.AUMARCHE, 10000, 100, 0, { nbActions: "50" })

            expect(result.success).toBe(true)
        })

        it("gère un lastPrice très élevé lors d'un achat par nb actions", () => {
            // 1 action × 50000€ = 50000€ > 10000€ de solde
            const result = parseWithSchema(TransactionType.BUY, FormMode.AUMARCHE, 10000, 50000, 0, { nbActions: "1" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "nbActions")
                expect(issue?.message).toBe("Montant total supérieur au solde disponible")
            }
        })

        it("gère un solde de 0 pour un achat", () => {
            const result = parseWithSchema(TransactionType.BUY, FormMode.MONTANT, 0, 100, 0, { montant: "1" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "montant")
                expect(issue?.message).toBe("Montant supérieur au solde disponible")
            }
        })

        it("gère 0 actions détenues pour une vente", () => {
            const result = parseWithSchema(TransactionType.SELL, FormMode.AUMARCHE, 10000, 100, 0, { nbActions: "1" })

            expect(result.success).toBe(false)
            if (!result.success) {
                const issue = findIssue(result, "nbActions")
                expect(issue?.message).toBe("Nombre d'actions supérieur à vos actions disponibles")
            }
        })

        it("gère une valeur décimale pour le montant", () => {
            const result = parseWithSchema(TransactionType.BUY, FormMode.MONTANT, 10000, 100, 0, { montant: "99.50" })

            expect(result.success).toBe(true)
        })

        it("gère une valeur décimale pour le nombre d'actions", () => {
            // Les actions fractionnées sont possibles
            const result = parseWithSchema(TransactionType.BUY, FormMode.AUMARCHE, 10000, 100, 0, { nbActions: "0.5" })

            expect(result.success).toBe(true)
        })
    })
})
