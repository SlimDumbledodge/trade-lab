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
    unrealizedPnl: {
        label: "Valeur",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

moment.locale("fr")

export function PortfolioPerformanceChart({ points, handleHover }: PortfolioPerformanceChartProps) {
    // Si pas de données, on affiche un graphique vide avec un point à zéro
    const emptyData: PortfolioPoint[] = [
        {
            recordedAt: new Date().toISOString(),
            holdingsValue: 0,
            unrealizedPnl: 0,
        },
    ]

    const chartData = !points || points.length === 0 ? emptyData : points
    const hasData = points && points.length > 0

    const values = chartData.map((point) => point.unrealizedPnl)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const firstPnl = Number(chartData[0].unrealizedPnl)
    const lastPnl = chartData[chartData.length - 1].unrealizedPnl
    const lastHoldingsValue = chartData[chartData.length - 1].holdingsValue

    React.useEffect(() => {
        // On initialise le hover sur le dernier point du graphique
        if (hasData) {
            handleHover(lastPnl, lastHoldingsValue)
        }
    }, [lastPnl, lastHoldingsValue, handleHover, hasData])

    const handleMouseLeave = () => {
        // On revient au dernier point quand la souris quitte le graphique
        handleHover(lastPnl, lastHoldingsValue)
    }

    return (
        <Card className="pt-0">
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
                    <AreaChart data={chartData} onMouseLeave={handleMouseLeave}>
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
                                const recordedAt = payload[0].payload.recordedAt
                                const formattedDate = moment(recordedAt).format("D MMMM. HH:mm")
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="text-sm font-medium mb-1">{formattedDate}</div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                style={{
                                                    backgroundColor:
                                                        Number(lastPnl - firstPnl) >= 0
                                                            ? "var(--chart-positiv)"
                                                            : "var(--chart-negativ)",
                                                }}
                                            />
                                            <span className="text-sm text-muted-foreground">Prix :</span>
                                            <span className="text-sm font-medium ml-auto">
                                                {Number(currentHoldingsValue).toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <defs>
                            <linearGradient id="fillunrealizedPnl" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="0%"
                                    stopColor={Number(lastPnl - firstPnl) >= 0 ? "var(--chart-positiv)" : "var(--chart-negativ)"}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={Number(lastPnl - firstPnl) >= 0 ? "var(--chart-positiv)" : "var(--chart-negativ)"}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <Area
                            dataKey="unrealizedPnl"
                            type="natural"
                            fill="url(#fillunrealizedPnl)"
                            stroke={Number(lastPnl - firstPnl) >= 0 ? "var(--chart-positiv)" : "var(--chart-negativ)"}
                            fillOpacity={0.7}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
