import type { Metadata } from "next"
import {
    BadgeFirstTrade,
    BadgeDiamond,
    BadgeStreak,
    BadgePortfolio,
    BadgeTrophy,
    BadgeRocket,
    BadgeShield,
    BadgeStar,
    BadgeChart,
    BadgeLightning,
    BadgeCrown,
    BadgeTarget,
} from "@/components/badges/BadgeIcon"

export const metadata: Metadata = {
    title: "Succès",
    description: "Découvrez tous les succès et badges disponibles sur Tradelab Studio.",
}

const badges = [
    { name: "Premier trade", description: "Effectuer votre tout premier ordre sur le marché", icon: BadgeFirstTrade },
    { name: "Diamant", description: "Atteindre un portefeuille d'une valeur exceptionnelle", icon: BadgeDiamond },
    { name: "Série en feu", description: "Enchaîner 7 jours consécutifs de connexion", icon: BadgeStreak },
    { name: "Gestionnaire", description: "Créer et gérer votre premier portefeuille", icon: BadgePortfolio },
    { name: "Champion", description: "Terminer premier du classement mensuel", icon: BadgeTrophy },
    { name: "Décollage", description: "Réaliser un gain de +50% sur un trade", icon: BadgeRocket },
    { name: "Protecteur", description: "Maintenir un portefeuille positif pendant 30 jours", icon: BadgeShield },
    { name: "Étoile montante", description: "Obtenir 5 trades gagnants consécutifs", icon: BadgeStar },
    { name: "Analyste", description: "Consulter plus de 100 graphiques différents", icon: BadgeChart },
    { name: "Éclair", description: "Exécuter 10 trades en moins d'une heure", icon: BadgeLightning },
    { name: "Roi du marché", description: "Dépasser les 100 000 € de volume total échangé", icon: BadgeCrown },
    { name: "Visée parfaite", description: "Atteindre exactement votre objectif de prix sur un ordre limite", icon: BadgeTarget },
]

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Succès</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Tous les badges à débloquer sur Tradelab Studio</p>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
                    {badges.map((badge) => (
                        <div
                            key={badge.name}
                            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
                        >
                            <badge.icon />
                            <h2 className="text-sm font-semibold text-foreground sm:text-base">{badge.name}</h2>
                            <p className="text-xs text-muted-foreground sm:text-sm">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
