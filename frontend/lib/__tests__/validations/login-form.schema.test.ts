import { describe, it, expect } from "vitest"
import { loginFormSchema } from "@/lib/validations/login-form.schema"

describe("loginFormSchema", () => {
    describe("cas valides", () => {
        it("accepte un email et un mot de passe valides", () => {
            const result = loginFormSchema.safeParse({
                email: "user@example.com",
                password: "monmotdepasse",
            })

            expect(result.success).toBe(true)
        })

        it("accepte un mot de passe court (pas de contrainte de longueur minimum)", () => {
            const result = loginFormSchema.safeParse({
                email: "user@example.com",
                password: "a",
            })

            expect(result.success).toBe(true)
        })
    })

    describe("email", () => {
        it("rejette un email vide", () => {
            const result = loginFormSchema.safeParse({
                email: "",
                password: "monmotdepasse",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const emailError = result.error.issues.find((i) => i.path.includes("email"))
                expect(emailError?.message).toBe("L'email est requis")
            }
        })

        it("rejette un email invalide", () => {
            const result = loginFormSchema.safeParse({
                email: "pas-un-email",
                password: "monmotdepasse",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const emailError = result.error.issues.find((i) => i.path.includes("email"))
                expect(emailError?.message).toBe("Email invalide")
            }
        })

        it("rejette un email sans domaine", () => {
            const result = loginFormSchema.safeParse({
                email: "user@",
                password: "monmotdepasse",
            })

            expect(result.success).toBe(false)
        })
    })

    describe("password", () => {
        it("rejette un mot de passe vide", () => {
            const result = loginFormSchema.safeParse({
                email: "user@example.com",
                password: "",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const pwdError = result.error.issues.find((i) => i.path.includes("password"))
                expect(pwdError?.message).toBe("Le mot de passe est requis")
            }
        })
    })

    describe("champs manquants", () => {
        it("rejette si aucun champ n'est fourni", () => {
            const result = loginFormSchema.safeParse({})

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
            }
        })

        it("rejette si le password est manquant", () => {
            const result = loginFormSchema.safeParse({
                email: "user@example.com",
            })

            expect(result.success).toBe(false)
        })

        it("rejette si l'email est manquant", () => {
            const result = loginFormSchema.safeParse({
                password: "monmotdepasse",
            })

            expect(result.success).toBe(false)
        })
    })
})
