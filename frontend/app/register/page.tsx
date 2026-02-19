import type { Metadata } from "next"
import RegisterForm from "@/components/forms/RegisterForm"

export const metadata: Metadata = {
    title: "Créer un compte",
    description:
        "Inscrivez-vous gratuitement sur Tradelab Studio et commencez à simuler vos investissements boursiers avec des données réelles.",
}

export default function Page() {
    return <RegisterForm />
}
