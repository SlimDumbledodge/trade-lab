"use client"

import { FrequencyType } from "@/types/types"

const frequencyDays: Record<FrequencyType, number> = {
    [FrequencyType.WEEKLY]: 7,
    [FrequencyType.TWICE_BY_MONTH]: 15,
    [FrequencyType.MONTHLY]: 30,
    [FrequencyType.QUARTERLY]: 90,
}

export function CountdownCircle({ daysUntil, frequency }: { daysUntil: number | null; frequency: FrequencyType }) {
    const size = 44
    const strokeWidth = 3
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    const totalDays = frequencyDays[frequency]
    const elapsed = daysUntil !== null ? totalDays - daysUntil : 0
    const progress = daysUntil !== null ? Math.min(Math.max(elapsed / totalDays, 0), 1) : 0
    const offset = circumference - progress * circumference

    // Unique ID to avoid SVG gradient conflicts when multiple circles are rendered
    const gradientId = `progressGradient-${frequency}-${daysUntil}`

    return (
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            <svg width={size} height={size} className="absolute -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-border/40"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                />
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="flex flex-col items-center leading-none">
                <span className="text-sm font-bold tabular-nums">{daysUntil !== null ? daysUntil : "—"}</span>
                <span className="text-[9px] text-muted-foreground">{daysUntil !== null ? "jours" : ""}</span>
            </div>
        </div>
    )
}

export function getDaysUntil(dateStr: string | null): number | null {
    if (!dateStr) return null
    const now = new Date()
    const target = new Date(dateStr)
    const diffMs = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
}

/**
 * Calcule le nombre de jours restants avant la première exécution
 * quand nextExecutionAt est null et isFirstExecution est true.
 * MONTH_START → le 2 du mois, MID_MONTH → le 16 du mois.
 */
export function getDaysUntilFirstExecution(firstExecution: "MONTH_START" | "MID_MONTH"): number {
    const targetDay = firstExecution === "MONTH_START" ? 2 : 16
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    let target = new Date(year, month, targetDay)

    // Si la date cible est déjà passée ce mois-ci, on prend le mois suivant
    if (target.getTime() <= now.getTime()) {
        target = new Date(year, month + 1, targetDay)
    }

    const diffMs = target.getTime() - now.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}
