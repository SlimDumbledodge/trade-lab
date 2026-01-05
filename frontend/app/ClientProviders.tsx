"use client"

import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme/ThemeProvider"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
                {children}
                <Toaster />
            </ThemeProvider>
        </SessionProvider>
    )
}
