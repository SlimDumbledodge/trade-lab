import "next-auth"
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface User extends DefaultUser {
        role?: string
        subscription?: string
        portfolioId?: string | null
        accessToken?: string
        avatarPath?: string | null
        createdAt?: string
    }

    interface Session extends DefaultSession {
        accessToken?: string
        user?: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        user?: import("next-auth").User
    }
}
