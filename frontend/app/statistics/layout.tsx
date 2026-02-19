import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Statistiques",
    description: "Analysez vos performances d'investissement avec les statistiques détaillées de Tradelab Studio.",
    robots: { index: false, follow: false },
}

export default function StatisticsLayout({ children }: { children: React.ReactNode }) {
    return children
}
