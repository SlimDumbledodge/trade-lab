import { describe, it, expect } from "vitest"
import { registerFormSchema } from "@/lib/validations/register-form.schema"

const validData = {
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
    confirmPassword: "password123",
    acceptTerms: true,
}

describe("registerFormSchema", () => {
    describe("cas valides", () => {
        it("accepte des données d'inscription valides", () => {
            const result = registerFormSchema.safeParse(validData)

            expect(result.success).toBe(true)
        })

        it("accepte un username de 3 caractères (minimum)", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                username: "abc",
            })

            expect(result.success).toBe(true)
        })

        it("accepte un mot de passe de 8 caractères (minimum)", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                password: "12345678",
                confirmPassword: "12345678",
            })

            expect(result.success).toBe(true)
        })
    })

    describe("username", () => {
        it("rejette un username trop court (< 3 caractères)", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                username: "ab",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const usernameError = result.error.issues.find((i) => i.path.includes("username"))
                expect(usernameError?.message).toBe("Le nom d'utilisateur doit contenir au moins 3 caractères")
            }
        })

        it("rejette un username vide", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                username: "",
            })

            expect(result.success).toBe(false)
        })
    })

    describe("email", () => {
        it("rejette un email vide", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                email: "",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const emailError = result.error.issues.find((i) => i.path.includes("email"))
                expect(emailError?.message).toBe("L'email est requis")
            }
        })

        it("rejette un email invalide", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                email: "pas-un-email",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const emailError = result.error.issues.find((i) => i.path.includes("email"))
                expect(emailError?.message).toBe("Email invalide")
            }
        })
    })

    describe("password", () => {
        it("rejette un mot de passe trop court (< 8 caractères)", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                password: "1234567",
                confirmPassword: "1234567",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const pwdError = result.error.issues.find((i) => i.path.includes("password"))
                expect(pwdError?.message).toBe("Le mot de passe doit contenir au moins 8 caractères")
            }
        })

        it("rejette un mot de passe vide", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                password: "",
                confirmPassword: "",
            })

            expect(result.success).toBe(false)
        })
    })

    describe("confirmPassword", () => {
        it("rejette si les mots de passe ne correspondent pas", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                password: "password123",
                confirmPassword: "different456",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const confirmError = result.error.issues.find((i) => i.path.includes("confirmPassword"))
                expect(confirmError?.message).toBe("Les mots de passe ne correspondent pas")
            }
        })

        it("rejette si confirmPassword est vide", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                confirmPassword: "",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const confirmError = result.error.issues.find((i) => i.path.includes("confirmPassword"))
                expect(confirmError?.message).toBe("Veuillez confirmer votre mot de passe")
            }
        })
    })

    describe("acceptTerms", () => {
        it("rejette si les CGU ne sont pas acceptées (false)", () => {
            const result = registerFormSchema.safeParse({
                ...validData,
                acceptTerms: false,
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const termsError = result.error.issues.find((i) => i.path.includes("acceptTerms"))
                expect(termsError?.message).toBe("Vous devez accepter les conditions générales")
            }
        })
    })

    describe("erreurs multiples", () => {
        it("retourne plusieurs erreurs si plusieurs champs sont invalides", () => {
            const result = registerFormSchema.safeParse({
                username: "",
                email: "invalid",
                password: "short",
                confirmPassword: "other",
                acceptTerms: false,
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                // username trop court, email invalide, password trop court, acceptTerms false
                // + confirmPassword ne match pas (mais cette erreur est un refine du top-level)
                expect(result.error.issues.length).toBeGreaterThanOrEqual(4)
            }
        })
    })
})
