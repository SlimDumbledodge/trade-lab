import { TrendingUp, TrendingDown } from "lucide-react"

interface PriceChangeProps {
    value: number | string
    unit?: "€" | "%"
}

export function PriceChange({ value, unit = "€" }: PriceChangeProps) {
    if (!value) {
        return <span className="">0.00 {unit}</span>
    }

    const numValue = Number(value)
    const isPositive = numValue > 0
    const isNegative = numValue < 0

    const colorClass = isPositive ? "text-green-500" : isNegative ? "text-red-500" : ""

    return (
        <span className={`font-semibold text-s flex items-center gap-1 ${colorClass}`}>
            {isPositive && <TrendingUp size={16} />}
            {isNegative && <TrendingDown size={16} />}
            {numValue.toFixed(2)} {unit}
        </span>
    )
}
