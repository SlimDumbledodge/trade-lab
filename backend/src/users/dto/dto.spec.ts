import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"
import { CreateUserDto } from "./create-user.dto"
import { UpdateUserDto } from "./update-user.dto"

describe("Users DTOs", () => {
    describe("CreateUserDto", () => {
        it("devrait valider avec des données correctes", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "testuser",
                email: "test@example.com",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        // --- username ---

        it("devrait échouer si le username est trop court (< 4 caractères)", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "ab",
                email: "test@example.com",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("username")
        })

        it("devrait valider si le username fait exactement 4 caractères", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "abcd",
                email: "test@example.com",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si le username est trop long (> 20 caractères)", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "a".repeat(21),
                email: "test@example.com",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("username")
        })

        it("devrait valider si le username fait exactement 20 caractères", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "a".repeat(20),
                email: "test@example.com",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si le username est absent", async () => {
            const dto = plainToInstance(CreateUserDto, {
                email: "test@example.com",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors.some((e) => e.property === "username")).toBe(true)
        })

        // --- email ---

        it("devrait échouer si l'email est invalide", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "testuser",
                email: "not-an-email",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("email")
        })

        it("devrait échouer si l'email est absent", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "testuser",
                password: "password123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors.some((e) => e.property === "email")).toBe(true)
        })

        // --- password ---

        it("devrait échouer si le password est trop court (< 6 caractères)", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "testuser",
                email: "test@example.com",
                password: "ab12",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("password")
        })

        it("devrait valider si le password fait exactement 6 caractères", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "testuser",
                email: "test@example.com",
                password: "abc123",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si le password est absent", async () => {
            const dto = plainToInstance(CreateUserDto, {
                username: "testuser",
                email: "test@example.com",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors.some((e) => e.property === "password")).toBe(true)
        })
    })

    describe("UpdateUserDto", () => {
        it("devrait valider avec seulement le username (partiel)", async () => {
            const dto = plainToInstance(UpdateUserDto, {
                username: "newname",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait valider avec seulement l'email (partiel)", async () => {
            const dto = plainToInstance(UpdateUserDto, {
                email: "new@example.com",
            })
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait valider avec un objet vide (tous les champs optionnels)", async () => {
            const dto = plainToInstance(UpdateUserDto, {})
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it("devrait échouer si le username fourni est trop court", async () => {
            const dto = plainToInstance(UpdateUserDto, {
                username: "ab",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("username")
        })

        it("devrait échouer si l'email fourni est invalide", async () => {
            const dto = plainToInstance(UpdateUserDto, {
                email: "not-an-email",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("email")
        })

        it("devrait échouer si le password fourni est trop court", async () => {
            const dto = plainToInstance(UpdateUserDto, {
                password: "abc",
            })
            const errors = await validate(dto)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].property).toBe("password")
        })
    })
})
