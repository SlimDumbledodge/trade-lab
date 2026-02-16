"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, ShoppingCart, BarChart3, Rocket } from "lucide-react"
import { completeOnboarding } from "@/lib/api"

type OnboardingStep = {
    icon: React.ReactNode
    title: string
    description: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        icon: <Wallet className="h-12 w-12 text-primary" />,
        title: "Bienvenue sur Tradelab !",
        description:
            "Vous disposez de 10 000 € virtuels pour apprendre le trading sans aucun risque. Pas de carte bancaire, pas de stress, juste de l'apprentissage.",
    },
    {
        icon: <TrendingUp className="h-12 w-12 text-primary" />,
        title: "Explorez le marché",
        description:
            "Consultez les actifs disponibles en temps réel dans l'onglet Marché. Suivez les cours, analysez les tendances et repérez vos opportunités.",
    },
    {
        icon: <ShoppingCart className="h-12 w-12 text-primary" />,
        title: "Passez vos premiers ordres",
        description:
            "Cliquez sur un actif pour voir son graphique détaillé et passer un ordre d'achat ou de vente. Définissez la quantité et confirmez !",
    },
    {
        icon: <BarChart3 className="h-12 w-12 text-primary" />,
        title: "Suivez vos performances",
        description:
            "Votre portefeuille affiche la valeur totale de vos investissements et votre PnL en temps réel. Consultez vos statistiques pour progresser.",
    },
    {
        icon: <Rocket className="h-12 w-12 text-primary" />,
        title: "C'est parti !",
        description:
            "Votre aventure commence maintenant. Rendez-vous sur le marché pour investir dans votre premier actif. Bonne chance !",
    },
]

export function OnboardingModal({ onDismiss }: { onDismiss: () => void }) {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [isOpen, setIsOpen] = useState(true)
    const [isCompleting, setIsCompleting] = useState(false)

    const step = ONBOARDING_STEPS[currentStep]
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1
    const isFirstStep = currentStep === 0

    const handleNext = () => {
        if (isLastStep) {
            handleComplete()
        } else {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleComplete = async () => {
        setIsCompleting(true)
        try {
            await completeOnboarding(session?.accessToken)

            // Mettre à jour la session NextAuth pour refléter le changement
            await update({
                user: {
                    ...session?.user,
                    hasCompletedOnboarding: true,
                },
            })

            onDismiss()
            setIsOpen(false)
        } catch {
            // En cas d'erreur, fermer quand même le modal pour ne pas bloquer l'utilisateur
            onDismiss()
            setIsOpen(false)
        } finally {
            setIsCompleting(false)
        }
    }

    const handleSkip = async () => {
        await handleComplete()
    }

    const handleGoToMarket = async () => {
        await handleComplete()
        router.push("/market")
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => handleSkip()}>
            <DialogContent className="sm:max-w-md" from="bottom">
                <DialogHeader className="items-center text-center">
                    <div className="mb-2 flex items-center justify-center">{step.icon}</div>
                    <DialogTitle className="text-xl">{step.title}</DialogTitle>
                    <DialogDescription className="text-center text-sm leading-relaxed">{step.description}</DialogDescription>
                </DialogHeader>

                {/* Indicateurs de progression */}
                <div className="flex items-center justify-center gap-1.5 py-2">
                    {ONBOARDING_STEPS.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentStep
                                    ? "w-6 bg-primary"
                                    : index < currentStep
                                      ? "w-1.5 bg-primary/60"
                                      : "w-1.5 bg-muted"
                            }`}
                        />
                    ))}
                </div>

                <DialogFooter className="flex-row gap-2 sm:justify-between">
                    {isFirstStep ? (
                        <Button variant="ghost" size="sm" onClick={handleSkip} disabled={isCompleting}>
                            Passer
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={handlePrevious}>
                            Précédent
                        </Button>
                    )}

                    {isLastStep ? (
                        <Button size="sm" onClick={handleGoToMarket} disabled={isCompleting}>
                            Explorer le marché
                        </Button>
                    ) : (
                        <Button size="sm" onClick={handleNext}>
                            Suivant
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
