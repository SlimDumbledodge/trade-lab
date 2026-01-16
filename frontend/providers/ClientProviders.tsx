"use client"

import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    )

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
                    {children}
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                        }}
                    />
                </ThemeProvider>
            </QueryClientProvider>
        </SessionProvider>
    )
}
