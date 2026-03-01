import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Contactez l'équipe Tradelab Studio pour toute question, suggestion ou signalement de bug. Nous répondons sous 24-48h.",
    openGraph: {
        title: "Contactez-nous — Tradelab Studio",
        description: "Une question ? Un problème ? Contactez l'équipe Tradelab Studio.",
    },
    alternates: {
        canonical: "https://tradelab-studio.fr/contact",
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children
}
