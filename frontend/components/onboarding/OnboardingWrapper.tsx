"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { OnboardingModal } from "./OnboardingModal"

export function OnboardingWrapper() {
    const { data: session, status } = useSession()
    const [dismissed, setDismissed] = useState(false)

    // Ne pas afficher tant que la session n'est pas chargée
    if (status !== "authenticated") return null

    // Ne pas afficher si l'onboarding est déjà terminé ou a été fermé localement
    if (session?.user?.hasCompletedOnboarding || dismissed) return null

    return <OnboardingModal onDismiss={() => setDismissed(true)} />
}
