import { describe, it, expect } from "vitest"
import { forgotPasswordFormSchema } from "@/lib/validations/forgot-password-form.schema"

describe("forgotPasswordFormSchema", () => {
    describe("cas valides", () => {
        it("accepte un email valide", () => {
            const result = forgotPasswordFormSchema.safeParse({
                email: "user@example.com",
            })

            expect(result.success).toBe(true)
        })
    })

    describe("email", () => {
        it("rejette un email vide", () => {
            const result = forgotPasswordFormSchema.safeParse({
                email: "",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("email"))
                expect(error?.message).toBe("L'email est requis")
            }
        })

        it("rejette un email invalide", () => {
            const result = forgotPasswordFormSchema.safeParse({
                email: "pas-un-email",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("email"))
                expect(error?.message).toBe("Email invalide")
            }
        })

        it("rejette si le champ email est manquant", () => {
            const result = forgotPasswordFormSchema.safeParse({})

            expect(result.success).toBe(false)
        })
    })
})
