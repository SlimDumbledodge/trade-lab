import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Marchés",
    description: "Explorez les marchés boursiers en temps réel sur Tradelab Studio. Suivez les cours des actions américaines.",
    robots: { index: false, follow: false },
}

export default function MarketLayout({ children }: { children: React.ReactNode }) {
    return children
}
