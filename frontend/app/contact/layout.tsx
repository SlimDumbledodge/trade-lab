import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Contactez l'équipe Tradelab Studio pour toute question, suggestion ou signalement de bug. Nous sommes là pour vous aider.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children
}
