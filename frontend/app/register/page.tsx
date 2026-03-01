import type { Metadata } from "next"
import RegisterForm from "@/components/forms/RegisterForm"

export const metadata: Metadata = {
    title: "Créer un compte gratuit",
    description:
        "Inscrivez-vous gratuitement sur Tradelab Studio et commencez à simuler vos investissements boursiers avec des données réelles. Recevez 10 000€ virtuels.",
    openGraph: {
        title: "Créer un compte gratuit — Tradelab Studio",
        description: "Commencez à investir avec 10 000€ virtuels. Inscription gratuite.",
    },
    alternates: {
        canonical: "https://tradelab-studio.fr/register",
    },
}

export default function Page() {
    return <RegisterForm />
}
