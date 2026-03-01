import type { Metadata } from "next"
import LoginForm from "@/components/forms/LoginForm"

export const metadata: Metadata = {
    title: "Connexion",
    description:
        "Connectez-vous à Tradelab Studio pour accéder à votre portefeuille de trading simulé et suivre vos investissements.",
    openGraph: {
        title: "Connexion — Tradelab Studio",
        description: "Accédez à votre portefeuille de trading simulé.",
    },
    alternates: {
        canonical: "https://tradelab-studio.fr/login",
    },
}

export default function Page() {
    return <LoginForm />
}
