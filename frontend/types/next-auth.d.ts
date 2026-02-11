import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface User extends DefaultUser {
        role?: string
        subscription?: string
        portfolioId?: string | null
        accessToken?: string
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
        user?: User
    }
}
