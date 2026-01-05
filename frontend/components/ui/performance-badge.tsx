"use client"

import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

type PerformanceBadgeProps = {
    change: number
    round?: number
    className?: string
}

export function PerformanceBadge({ change, round, className }: PerformanceBadgeProps) {
    const isPositive = change >= 0
    const Icon = isPositive ? IconTrendingUp : IconTrendingDown
    const value = round ? Number(change.toFixed(round)) : change

    return (
        <Badge className={`${className ?? ""} ${isPositive ? "bg-green-600" : "bg-red-600"} text-white`}>
            <Icon className="mr-1 size-4" />
            {value}%
        </Badge>
    )
}
