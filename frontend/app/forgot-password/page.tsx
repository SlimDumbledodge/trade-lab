import type { Metadata } from "next"
import ForgotPassword from "@/components/forms/ForgotPasswordForm"

export const metadata: Metadata = {
    title: "Mot de passe oublié",
    description:
        "Réinitialisez votre mot de passe Tradelab Studio. Entrez votre adresse email pour recevoir un lien de réinitialisation.",
    robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
    return <ForgotPassword />
}
