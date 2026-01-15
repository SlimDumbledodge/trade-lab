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

    return (
        <Card className="pt-0">
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={data}>
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
                                const value = payload[0].payload.recordedAt
                                const first = moment(data[0]?.recordedAt)
                                const last = moment(data[data.length - 1]?.recordedAt)
                                const durationDays = last.diff(first, "days")

                                let formattedDate = ""
                                if (durationDays < 1) {
                                    formattedDate = moment(value).format("DD/MM/YYYY - HH:mm")
                                } else if (durationDays < 7) {
                                    formattedDate = moment(value).format("DD/MM/YYYY - HH:mm")
                                } else if (durationDays < 60) {
                                    formattedDate = moment(value).format("DD/MM/YYYY - HH:mm")
                                } else {
                                    formattedDate = moment(value).format("DD/MM/YYYY")
                                }

                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="text-sm font-medium">{formattedDate}</div>
                                    </div>
                                )
                            }}
                        />

                        <Area dataKey="closingPrice" type="natural" fill="var(--chart-1)" stroke="var(--chart-1)" />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
