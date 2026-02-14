import { describe, it, expect } from "vitest"
import { contactFormSchema } from "@/lib/validations/contact-form.schema"

const validData = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean@example.com",
    subject: "Question sur mon portefeuille",
    message: "Bonjour, j'ai une question concernant la gestion de mon portefeuille virtuel.",
}

describe("contactFormSchema", () => {
    describe("cas valides", () => {
        it("accepte des données de contact valides", () => {
            const result = contactFormSchema.safeParse(validData)

            expect(result.success).toBe(true)
        })

        it("accepte les valeurs minimales pour chaque champ", () => {
            const result = contactFormSchema.safeParse({
                firstName: "AB",
                lastName: "CD",
                email: "a@b.co",
                subject: "Hello",
                message: "Ce message fait vingt c",
            })

            expect(result.success).toBe(true)
        })
    })

    describe("firstName", () => {
        it("rejette un prénom trop court (< 2 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                firstName: "A",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("firstName"))
                expect(error?.message).toBe("Le prénom doit contenir au moins 2 caractères")
            }
        })

        it("rejette un prénom trop long (> 50 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                firstName: "A".repeat(51),
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("firstName"))
                expect(error?.message).toBe("Le prénom est trop long")
            }
        })

        it("accepte un prénom de 50 caractères (maximum)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                firstName: "A".repeat(50),
            })

            expect(result.success).toBe(true)
        })
    })

    describe("lastName", () => {
        it("rejette un nom trop court (< 2 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                lastName: "D",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("lastName"))
                expect(error?.message).toBe("Le nom doit contenir au moins 2 caractères")
            }
        })

        it("rejette un nom trop long (> 50 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                lastName: "D".repeat(51),
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("lastName"))
                expect(error?.message).toBe("Le nom est trop long")
            }
        })
    })

    describe("email", () => {
        it("rejette un email invalide", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                email: "invalide",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("email"))
                expect(error?.message).toBe("Veuillez entrer une adresse email valide")
            }
        })

        it("rejette un email vide", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                email: "",
            })

            expect(result.success).toBe(false)
        })
    })

    describe("subject", () => {
        it("rejette un sujet trop court (< 5 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                subject: "Hey!",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("subject"))
                expect(error?.message).toBe("Le sujet doit contenir au moins 5 caractères")
            }
        })

        it("rejette un sujet trop long (> 100 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                subject: "S".repeat(101),
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("subject"))
                expect(error?.message).toBe("Le sujet est trop long (max 100 caractères)")
            }
        })

        it("accepte un sujet de 100 caractères (maximum)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                subject: "S".repeat(100),
            })

            expect(result.success).toBe(true)
        })
    })

    describe("message", () => {
        it("rejette un message trop court (< 20 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                message: "Trop court.",
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("message"))
                expect(error?.message).toBe("Le message doit contenir au moins 20 caractères")
            }
        })

        it("rejette un message trop long (> 1000 caractères)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                message: "M".repeat(1001),
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("message"))
                expect(error?.message).toBe("Le message est trop long (max 1000 caractères)")
            }
        })

        it("accepte un message de 1000 caractères (maximum)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                message: "M".repeat(1000),
            })

            expect(result.success).toBe(true)
        })

        it("accepte un message de 20 caractères (minimum)", () => {
            const result = contactFormSchema.safeParse({
                ...validData,
                message: "M".repeat(20),
            })

            expect(result.success).toBe(true)
        })
    })
})
