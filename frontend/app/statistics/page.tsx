"use client"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Clock } from "lucide-react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { StatsKpiCards } from "@/components/statistics/StatsKpiCards"
import { Suspense, useEffect, useState } from "react"
import { HoldingsPieChart } from "@/components/charts/HoldingsPieChart"
import { PerformanceCard } from "@/components/portfolio/PerformanceCard"
import { PortfolioAssetCard } from "@/components/portfolio/PortfolioAssetsCard"
import { SkeletonChart } from "@/components/ui/skeleton-chart"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type StatsType = "positions" | "actifs"

function Statistics() {
    const [statsType, setStatsType] = useState<StatsType>("positions")
    useEffect(() => {
        document.title = "Tradelab Studio - Statistiques"
    }, [])

    return (
        <HomeLayout headerTitle="Statistiques">
            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="px-2 sm:px-0">
                    <h1 className="text-2xl sm:text-3xl font-bold">Statistiques</h1>
                </div>

                {/* KPI Cards */}
                <StatsKpiCards />

                <div className="flex flex-col min-[1200px]:flex-row gap-4 sm:gap-6 min-[1200px]:items-stretch">
                    {/* Graphique à gauche */}
                    <div className="flex-1 min-w-0 flex">
                        <Suspense fallback={<SkeletonChart />}>
                            <Card className="flex flex-col w-full h-full min-h-[400px] min-[1200px]:min-h-[500px]">
                                <CardHeader className="items-center pb-2 sm:pb-0">
                                    <Tabs
                                        className="w-[400px]"
                                        value={statsType}
                                        onValueChange={(value) => setStatsType(value as StatsType)}
                                    >
                                        <TabsList>
                                            <TabsTrigger value="positions" className="text-base">
                                                Positions
                                            </TabsTrigger>
                                            <TabsTrigger value="actif" className="text-base">
                                                Actifs
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </CardHeader>
                                <CardContent className="flex-1 pb-0">
                                    {statsType === "positions" ? (
                                        <HoldingsPieChart />
                                    ) : (
                                        <Empty className="bg-muted/30 h-full">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <Clock />
                                                </EmptyMedia>
                                                <EmptyTitle>Bientôt disponible</EmptyTitle>
                                                <EmptyDescription className="max-w-xs text-pretty">
                                                    Cette fonctionnalité est en cours de développement et sera disponible très
                                                    prochainement.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    )}
                                </CardContent>
                            </Card>
                        </Suspense>
                    </div>

                    {/* Cards à droite */}
                    <div className="flex flex-col gap-4 sm:gap-6 w-full min-[1200px]:w-[320px] shrink-0">
                        <PerformanceCard />
                        <PortfolioAssetCard />
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default Statistics
