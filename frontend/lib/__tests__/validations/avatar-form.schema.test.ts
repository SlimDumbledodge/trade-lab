import { describe, it, expect } from "vitest"
import { avatarFormSchema } from "@/lib/validations/avatar-form.schema"

const createFile = (size: number, type: string, name = "avatar.jpg") => {
    const buffer = new ArrayBuffer(size)
    return new File([buffer], name, { type })
}

describe("avatarFormSchema", () => {
    describe("cas valides", () => {
        it("accepte un fichier JPEG valide", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(1024, "image/jpeg") })
            expect(result.success).toBe(true)
        })

        it("accepte un fichier PNG valide", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(1024, "image/png") })
            expect(result.success).toBe(true)
        })

        it("accepte un fichier GIF valide", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(1024, "image/gif") })
            expect(result.success).toBe(true)
        })

        it("accepte un fichier WebP valide", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(1024, "image/webp") })
            expect(result.success).toBe(true)
        })

        it("accepte un fichier de exactement 5 Mo", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(5 * 1024 * 1024, "image/jpeg") })
            expect(result.success).toBe(true)
        })
    })

    describe("avatar", () => {
        it("rejette un fichier dépassant 5 Mo", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(5 * 1024 * 1024 + 1, "image/jpeg") })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("avatar"))
                expect(error?.message).toBe("Le fichier ne doit pas dépasser 5 Mo")
            }
        })

        it("rejette un fichier SVG", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(1024, "image/svg+xml") })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("avatar"))
                expect(error?.message).toBe("Format accepté : JPEG, PNG, GIF, WebP")
            }
        })

        it("rejette un fichier PDF", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(1024, "application/pdf") })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("avatar"))
                expect(error?.message).toBe("Format accepté : JPEG, PNG, GIF, WebP")
            }
        })

        it("rejette un fichier texte", () => {
            const result = avatarFormSchema.safeParse({ avatar: createFile(1024, "text/plain") })

            expect(result.success).toBe(false)
            if (!result.success) {
                const error = result.error.issues.find((i) => i.path.includes("avatar"))
                expect(error?.message).toBe("Format accepté : JPEG, PNG, GIF, WebP")
            }
        })

        it("rejette si avatar est absent", () => {
            const result = avatarFormSchema.safeParse({})

            expect(result.success).toBe(false)
        })

        it("rejette si avatar n'est pas un File", () => {
            const result = avatarFormSchema.safeParse({ avatar: "not-a-file" })

            expect(result.success).toBe(false)
        })

        it("rejette si avatar est null", () => {
            const result = avatarFormSchema.safeParse({ avatar: null })

            expect(result.success).toBe(false)
        })
    })
})
