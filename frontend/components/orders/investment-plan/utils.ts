import { FrequencyType, FirstExecutionType } from "@/types/types"

export const STEPS = ["frequency", "firstExecution", "amount", "confirmation"] as const
export type Step = (typeof STEPS)[number]

export const frequencyOptions = [
    {
        value: FrequencyType.WEEKLY,
        label: "Chaque semaine",
        description: "Exécuté chaque semaine",
    },
    {
        value: FrequencyType.TWICE_BY_MONTH,
        label: "Deux fois par mois",
        description: "Exécuté au début et au milieu du mois",
    },
    {
        value: FrequencyType.MONTHLY,
        label: "Chaque mois",
        description: "Exécuté chaque mois",
    },
    {
        value: FrequencyType.QUARTERLY,
        label: "Trimestriel",
        description: "Exécuté tous les trois mois",
    },
]

export const frequencyLabels: Record<FrequencyType, string> = {
    [FrequencyType.WEEKLY]: "Chaque semaine",
    [FrequencyType.TWICE_BY_MONTH]: "Deux fois par mois",
    [FrequencyType.MONTHLY]: "Chaque mois",
    [FrequencyType.QUARTERLY]: "Chaque trimestre",
}

export function getFirstExecutionDate(type: FirstExecutionType): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const nextMonth = month + 1 > 11 ? 0 : month + 1
    const nextYear = month + 1 > 11 ? year + 1 : year

    if (type === FirstExecutionType.MONTH_START) {
        const date = new Date(nextYear, nextMonth, 2)
        return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    } else {
        const date = new Date(nextYear, nextMonth, 16)
        return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    }
}

export function getFirstExecutionShortDate(type: FirstExecutionType): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const nextMonth = month + 1 > 11 ? 0 : month + 1
    const nextYear = month + 1 > 11 ? year + 1 : year

    if (type === FirstExecutionType.MONTH_START) {
        const date = new Date(nextYear, nextMonth, 2)
        return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    } else {
        const date = new Date(nextYear, nextMonth, 16)
        return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    }
}
