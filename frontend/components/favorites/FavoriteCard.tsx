"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { TrendingUp, TrendingDown, Star, ArrowUpRight, BarChart3, ShoppingCart } from "lucide-react"
import Image from "next/image"

export type FavoriteAsset = {
    id: number
    symbol: string
    name: string
    logo: string
    category: string
    price: number
    change: number
    changePercent: number
    volume: string
    sparkline: number[]
}

interface FavoriteCardProps {
    asset: FavoriteAsset
    index: number
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const width = 100
    const height = 32

    const points = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * width
            const y = height - ((v - min) / range) * height
            return `${x},${y}`
        })
        .join(" ")

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${positive ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={positive ? "rgb(34 197 94)" : "rgb(239 68 68)"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={positive ? "rgb(34 197 94)" : "rgb(239 68 68)"} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#grad-${positive ? "up" : "down"})`} />
            <polyline
                points={points}
                fill="none"
                stroke={positive ? "rgb(34 197 94)" : "rgb(239 68 68)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function FavoriteCard({ asset, index }: FavoriteCardProps) {
    const isPositive = asset.changePercent >= 0

    return (
        <Card
            className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 py-0"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Gradient accent top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Header */}
            <div className="flex items-start justify-between p-4 pb-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Image
                            className="rounded-xl shadow-sm ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-105"
                            src={asset.logo}
                            alt={asset.symbol}
                            width={40}
                            height={40}
                        />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
                            <div className={`h-2 w-2 rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm leading-tight">{asset.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-muted-foreground font-medium">{asset.symbol}</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                                {asset.category}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-yellow-500 hover:text-yellow-400 shrink-0">
                            <Star className="h-4 w-4 fill-current" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Retirer des favoris</TooltipContent>
                </Tooltip>
            </div>

            {/* Sparkline */}
            <div className="px-4 pt-3">
                <MiniSparkline data={asset.sparkline} positive={isPositive} />
            </div>

            {/* Price & Change */}
            <div className="flex items-end justify-between p-4 pt-2">
                <div className="flex flex-col">
                    <span className="text-lg font-bold tracking-tight">{asset.price.toFixed(2)} €</span>
                    <span className="text-[11px] text-muted-foreground">Vol. {asset.volume}</span>
                </div>
                <div
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                        isPositive
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                >
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? "+" : ""}
                    {asset.changePercent.toFixed(2)}%
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 border-t border-border/50 bg-muted/30 px-3 py-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs flex-1">
                            <ShoppingCart className="h-3 w-3" />
                            Trader
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Acheter ou vendre</TooltipContent>
                </Tooltip>
                <div className="h-4 w-px bg-border/50" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs flex-1">
                            <BarChart3 className="h-3 w-3" />
                            Détails
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voir les détails du marché</TooltipContent>
                </Tooltip>
                <div className="h-4 w-px bg-border/50" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ArrowUpRight className="h-3 w-3" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ouvrir</TooltipContent>
                </Tooltip>
            </div>
        </Card>
    )
}
