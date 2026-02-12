import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import ClientProviders from "../providers/ClientProviders"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
    title: {
        default: "Tradelab Studio",
        template: "Tradelab Studio | %s",
    },
    description: "Plateforme de trading simulée",
    icons: {
        icon: "/icon.png",
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    )
}
