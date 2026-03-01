import type { Metadata } from "next"
import React, { Suspense } from "react"
import ResetPassword from "@/components/forms/ResetPasswordForm"

export const metadata: Metadata = {
    title: "Réinitialiser le mot de passe",
    description: "Choisissez un nouveau mot de passe pour votre compte Tradelab Studio.",
    robots: { index: false, follow: false },
}

export default function Page() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ResetPassword />
        </Suspense>
    )
}
