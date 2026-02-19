import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Transactions",
    description: "Consultez l'historique de vos transactions sur Tradelab Studio.",
    robots: { index: false, follow: false },
}

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
    return children
}
