import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"
import { LoginDto } from "./login.dto"
import { ForgotPasswordDto } from "./forgot-password.dto"
import { ResetPasswordDto } from "./reset-password.dto"

describe("Auth DTOs", () => {
    describe("LoginDto", () => {
        it("devrait valider avec un email et un password corrects", async () => {
            const dto = plainToInstance(LoginDto, {
                email: "test@example.com",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si l'email est invalide", async () => {
            const dto = plainToInstance(LoginDto, {
                email: "not-an-email",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("email")
        })

        it("devrait échouer si l'email est vide", async () => {
            const dto = plainToInstance(LoginDto, {
                email: "",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("email")
        })

        it("devrait échouer si le password est vide", async () => {
            const dto = plainToInstance(LoginDto, {
                email: "test@example.com",
                password: "",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("password")
        })

        it("devrait échouer si l'email est absent", async () => {
            const dto = plainToInstance(LoginDto, {
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors.some((e) => e.property === "email")).toBe(true)
        })

        it("devrait échouer si le password est absent", async () => {
            const dto = plainToInstance(LoginDto, {
                email: "test@example.com",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors.some((e) => e.property === "password")).toBe(true)
        })
    })

    describe("ForgotPasswordDto", () => {
        it("devrait valider avec un email correct", async () => {
            const dto = plainToInstance(ForgotPasswordDto, {
                email: "test@example.com",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si l'email est invalide", async () => {
            const dto = plainToInstance(ForgotPasswordDto, {
                email: "not-an-email",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("email")
        })

        it("devrait échouer si l'email est vide", async () => {
            const dto = plainToInstance(ForgotPasswordDto, {
                email: "",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("email")
        })

        it("devrait échouer si l'email est absent", async () => {
            const dto = plainToInstance(ForgotPasswordDto, {})
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("email")
        })
    })

    describe("ResetPasswordDto", () => {
        it("devrait valider avec un token et un newPassword corrects", async () => {
            const dto = plainToInstance(ResetPasswordDto, {
                token: "valid-token-123",
                newPassword: "newPassword123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si le token est vide", async () => {
            const dto = plainToInstance(ResetPasswordDto, {
                token: "",
                newPassword: "newPassword123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("token")
        })

        it("devrait échouer si le token est absent", async () => {
            const dto = plainToInstance(ResetPasswordDto, {
                newPassword: "newPassword123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors.some((e) => e.property === "token")).toBe(true)
        })

        it("devrait échouer si newPassword est trop court (< 6 caractères)", async () => {
            const dto = plainToInstance(ResetPasswordDto, {
                token: "valid-token-123",
                newPassword: "ab12",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("newPassword")
        })

        it("devrait valider si newPassword fait exactement 6 caractères", async () => {
            const dto = plainToInstance(ResetPasswordDto, {
                token: "valid-token-123",
                newPassword: "abc123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si newPassword est vide", async () => {
            const dto = plainToInstance(ResetPasswordDto, {
                token: "valid-token-123",
                newPassword: "",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("newPassword")
        })

        it("devrait échouer si newPassword est absent", async () => {
            const dto = plainToInstance(ResetPasswordDto, {
                token: "valid-token-123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors.some((e) => e.property === "newPassword")).toBe(true)
        })
    })
})
