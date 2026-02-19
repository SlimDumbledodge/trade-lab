import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Portefeuille",
    description: "Gérez votre portefeuille virtuel sur Tradelab Studio. Suivez vos positions et vos performances en temps réel.",
    robots: { index: false, follow: false },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
    return children
}
