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

    return (
        <div
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                isPositive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
        >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {numValue.toFixed(2)}
            {unit}
        </div>
    )
}
