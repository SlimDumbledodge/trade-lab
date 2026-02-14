import { describe, it, expect } from "vitest"
import { resetPasswordFormSchema } from "@/lib/validations/reset-password-form.schema"

describe("resetPasswordFormSchema", () => {
    describe("cas valides", () => {
        it("accepte des mots de passe identiques et valides", () => {
            const result = resetPasswordFormSchema.safeParse({
                newPassword: "password123",
                confirmPassword: "password123",
            })

            expect(result.success).toBe(true)
        })

        it("accepte un mot de passe de 8 caractères (minimum)", () => {
            const result = resetPasswordFormSchema.safeParse({
                newPassword: "12345678",
                confirmPassword: "12345678",
            })

            expect(result.success).toBe(true)
        })
    })

    describe("newPassword", () => {
        it("rejette un mot de passe trop court (< 8 caractères)", () => {
            const result = resetPasswordFormSchema.safeParse({
                newPassword: "1234567",
                confirmPassword: "1234567",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("newPassword"))
                expect(error?.message).toBe("Le mot de passe doit contenir au moins 8 caractères")
            }
        })

        it("rejette un mot de passe vide", () => {
            const result = resetPasswordFormSchema.safeParse({
                newPassword: "",
                confirmPassword: "",
            })

            expect(result.success).toBe(false)
        })
    })

    describe("confirmPassword", () => {
        it("rejette si les mots de passe ne correspondent pas", () => {
            const result = resetPasswordFormSchema.safeParse({
                newPassword: "password123",
                confirmPassword: "different456",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("confirmPassword"))
                expect(error?.message).toBe("Les mots de passe ne correspondent pas")
            }
        })

        it("rejette si confirmPassword est vide alors que newPassword est valide", () => {
            const result = resetPasswordFormSchema.safeParse({
                newPassword: "password123",
                confirmPassword: "",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("confirmPassword"))
                expect(error?.message).toBe("Les mots de passe ne correspondent pas")
            }
        })
    })

    describe("champs manquants", () => {
        it("rejette si aucun champ n'est fourni", () => {
            const result = resetPasswordFormSchema.safeParse({})

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues.length).toBeGreaterThanOrEqual(1)
            }
        })
    })
})
