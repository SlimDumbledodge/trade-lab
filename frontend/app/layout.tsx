import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import ClientProviders from "../providers/ClientProviders"

const geistSans = GeistSans
const geistMono = GeistMono

const siteUrl = "https://tradelab-studio.fr"

export const metadata: Metadata = {
    title: {
        default: "Tradelab Studio",
        template: "%s | Tradelab Studio",
    },
    description:
        "Simulez vos investissements boursiers avec des données réelles. Apprenez le trading, testez vos stratégies et développez vos compétences sans risque.",
    metadataBase: new URL(siteUrl),
    icons: {
        icon: "/icon.png",
        apple: "/apple.png",
    },
    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: siteUrl,
        siteName: "Tradelab Studio",
        title: "Tradelab Studio — Simulateur de trading",
        description:
            "Simulez vos investissements boursiers avec des données réelles. Apprenez le trading, testez vos stratégies et développez vos compétences sans risque.",
        images: [
            {
                url: "/landing.png",
                width: 1200,
                height: 630,
                alt: "Tradelab Studio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Tradelab Studio — Simulateur de trading",
        description:
            "Simulez vos investissements boursiers avec des données réelles. Apprenez, testez et progressez sans risque.",
        images: ["/landing.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: siteUrl,
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    )
}
