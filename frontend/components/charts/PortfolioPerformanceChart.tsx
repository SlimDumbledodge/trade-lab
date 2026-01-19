import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import moment from "moment"
import "moment/locale/fr"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, type ChartConfig } from "@/components/ui/chart"

export type PortfolioPoint = {
    recordedAt: string
    holdingsValue: number
    unrealizedPnl: number
}

type PortfolioPerformanceChartProps = {
    points: PortfolioPoint[]
    handleHover: (currentPnl: number, currentHoldingsValue: number) => void
}

const chartConfig = {
    holdingsValue: {
        label: "Valeur",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

moment.locale("fr")

export function PortfolioPerformanceChart({ points, handleHover }: PortfolioPerformanceChartProps) {
    if (!points || points.length === 0) return <p>Pas de données</p>

    const values = points.map((point) => point.unrealizedPnl)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const firstPnl = Number(points[0].unrealizedPnl)
    const lastPnl = points[points.length - 1].unrealizedPnl

    return (
        <Card className="pt-0">
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={points}>
                        <CartesianGrid vertical={false} />

                        <XAxis dataKey="recordedAt" tickLine={false} axisLine={false} tick={false} />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={60}
                            domain={[minValue - 0.1, maxValue]}
                            tickFormatter={(v) => `${v.toFixed(2)}€`}
                        />

                        <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth={1.5} />

                        <ChartTooltip
                            content={({ active, payload }) => {
                                if (!active || !payload || !payload.length) return null
                                const currentPnl = Number(payload[0].payload.unrealizedPnl)
                                const currentHoldingsValue = Number(payload[0].payload.holdingsValue)
                                handleHover(currentPnl, currentHoldingsValue)
                            }}
                        />

                        <Area dataKey="unrealizedPnl" type="natural" fill="var(--chart-1)" stroke="var(--chart-1)" />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
