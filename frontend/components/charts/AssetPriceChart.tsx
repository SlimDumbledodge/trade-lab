import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import moment from "moment"
import "moment/locale/fr"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, type ChartConfig } from "@/components/ui/chart"

export type PricePoint = {
    recordedAt: string
    closingPrice: number
}

type ChartAreaInteractiveProps = {
    data: PricePoint[]
    handlePerformanceData: (valueEur: number, valuePercent: number) => void
}

const chartConfig = {
    closingPrice: {
        label: "Prix",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

moment.locale("fr")
export function AssetPriceChart({ data, handlePerformanceData }: ChartAreaInteractiveProps) {
    if (!data || data.length === 0) return <p>Pas de data</p>

    const prices = data.map((d) => d.closingPrice)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const openingPrice = data[0].closingPrice
    const lastPrice = data[data.length - 1].closingPrice

    // Afficher le dernier prix au montage du composant
    React.useEffect(() => {
        handlePerformanceData(lastPrice, openingPrice)
    }, [lastPrice, openingPrice, handlePerformanceData])

    // Revenir au dernier prix quand on quitte le graphique
    const handleMouseLeave = () => {
        handlePerformanceData(lastPrice, openingPrice)
    }

    return (
        <Card className="pt-0">
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[345px] w-full">
                    <AreaChart data={data} onMouseLeave={handleMouseLeave}>
                        <CartesianGrid vertical={false} />

                        <XAxis dataKey="recordedAt" tickLine={false} axisLine={false} tick={false} />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={60}
                            domain={[minPrice - 0.1, maxPrice]}
                            tickFormatter={(v) => `${v.toFixed(2)}€`}
                        />

                        {/* Ligne horizontale du prix d’ouverture */}
                        <ReferenceLine
                            y={openingPrice}
                            stroke="var(--muted-foreground)"
                            strokeDasharray="4 4"
                            strokeWidth={1.5}
                            label={{
                                value: `Ouverture ${openingPrice}€`,
                                position: "right",
                                fill: "var(--muted-foreground)",
                                fontSize: 12,
                                offset: 6,
                            }}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (!active || !payload || !payload.length) return null

                                handlePerformanceData(payload[0].payload.closingPrice, openingPrice)
                                const recordedAt = payload[0].payload.recordedAt
                                const closingPrice = payload[0].payload.closingPrice
                                const formattedDate = moment(recordedAt).format("D MMMM. HH:mm")

                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="text-sm font-medium mb-1">{formattedDate}</div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                style={{
                                                    backgroundColor:
                                                        Number(lastPrice - openingPrice) >= 0
                                                            ? "var(--chart-positiv)"
                                                            : "var(--chart-negativ)",
                                                }}
                                            />
                                            <span className="text-sm text-muted-foreground">Prix :</span>
                                            <span className="text-sm font-medium ml-auto">
                                                {Number(closingPrice).toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                                )
                            }}
                        />

                        <defs>
                            <linearGradient id="fillClosingPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="0%"
                                    stopColor={
                                        Number(lastPrice - openingPrice) >= 0 ? "var(--chart-positiv)" : "var(--chart-negativ)"
                                    }
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={
                                        Number(lastPrice - openingPrice) >= 0 ? "var(--chart-positiv)" : "var(--chart-negativ)"
                                    }
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <Area
                            dataKey="closingPrice"
                            type="natural"
                            fill="url(#fillClosingPrice)"
                            stroke={Number(lastPrice - openingPrice) >= 0 ? "var(--chart-positiv)" : "var(--chart-negativ)"}
                            fillOpacity={0.7}
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
