"use client"

import { useMemo, useState } from "react"
import { Label, Pie, PieChart, Sector } from "recharts"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { useSession } from "next-auth/react"
import { usePortfolioAssets } from "@/hooks/usePortfolioAssets"
import { usePortfolio } from "@/hooks/usePortfolio"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

// Palette de couleurs modernes et vibrantes
const COLORS = [
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#f59e0b", // amber-500
    "#10b981", // emerald-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
    "#a855f7", // purple-500
]

export function HoldingsPieChart() {
    const { data: session } = useSession()
    const { data: portfolioAssets, error: errorPortfolioAssets } = usePortfolioAssets(session?.accessToken)
    const { data: portfolio } = usePortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, session?.accessToken)
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

    // Créer dynamiquement la chartConfig basée sur les assets
    const chartConfig = useMemo(() => {
        if (!portfolioAssets) return {} as ChartConfig

        const config: ChartConfig = {
            weight: {
                label: "Poids",
            },
        }

        portfolioAssets.forEach((position, index) => {
            config[position.asset.symbol.toLowerCase()] = {
                label: position.asset.name,
                color: COLORS[index % COLORS.length],
            }
        })

        return config
    }, [portfolioAssets])

    if (errorPortfolioAssets) return <p className="text-red-600">{errorPortfolioAssets?.message}</p>

    const chartData = portfolioAssets?.map((position, index) => ({
        asset: position.asset.symbol.toLowerCase(),
        name: position.asset.name,
        symbol: position.asset.symbol,
        weight: Number(position.weight),
        holdingValue: Number(position.holdingValue),
        fill: COLORS[index % COLORS.length],
    }))

    const centerLabel =
        activeIndex !== undefined && chartData?.[activeIndex]
            ? {
                  value: `${chartData[activeIndex].holdingValue.toFixed(2)} €`,
                  label: chartData[activeIndex].name,
                  percentage: `${chartData[activeIndex].weight.toFixed(2)}%`,
              }
            : {
                  value: `${Number(portfolio?.holdingsValue ?? 0).toFixed(2)} €`,
                  label: "Total",
                  percentage: null,
              }

    return (
        <div className="relative w-full h-full flex flex-col">
            <ChartContainer config={chartConfig} className="mx-auto w-full aspect-square sm:max-h-[400px] lg:max-h-[450px]">
                <PieChart>
                    <defs>
                        {COLORS.map((color, index) => (
                            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                            </linearGradient>
                        ))}
                    </defs>
                    <ChartTooltip
                        cursor={false}
                        content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null
                            const data = payload[0].payload
                            return (
                                <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-sm p-3 shadow-xl">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 shrink-0 rounded-[2px]"
                                                style={{
                                                    backgroundColor: data.fill,
                                                }}
                                            />
                                            <span className="text-sm font-semibold">{data.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="text-muted-foreground">Valeur</span>
                                            <span className="font-bold">{data.holdingValue.toFixed(2)} €</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="text-muted-foreground">Poids</span>
                                            <span className="font-bold">{data.weight.toFixed(2)}%</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }}
                    />
                    <Pie
                        data={chartData}
                        dataKey="weight"
                        nameKey="name"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={2}
                        activeIndex={activeIndex}
                        activeShape={(props: PieSectorDataItem) => {
                            const { outerRadius = 0, fill, ...rest } = props
                            return (
                                <Sector
                                    {...rest}
                                    outerRadius={outerRadius + 12}
                                    fill={fill}
                                    style={{
                                        transition: "all 0.3s ease-in-out",
                                    }}
                                />
                            )
                        }}
                        onClick={(_, index) => {
                            setActiveIndex((prev) => (prev === index ? undefined : index))
                        }}
                        className="cursor-pointer border-4 border-amber-800"
                        style={{
                            transition: "all 0.3s ease-in-out",
                        }}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-lg sm:text-xl md:text-2xl font-bold"
                                            >
                                                {centerLabel.value}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 22}
                                                className="fill-muted-foreground text-xs sm:text-sm"
                                            >
                                                {centerLabel.label}
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="asset" />}
                        className=" flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                </PieChart>
            </ChartContainer>
        </div>
    )
}
