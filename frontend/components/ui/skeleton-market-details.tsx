import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkeletonMarketDetails() {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Partie gauche: En-tête, boutons de période et graphique */}
            <div className="flex-1 flex flex-col gap-6">
                {/* En-tête avec logo et informations */}
                <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-7 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>
                </div>

                {/* Boutons de période */}
                <div className="flex self-end gap-2">
                    <Skeleton className="h-9 w-12" />
                    <Skeleton className="h-9 w-12" />
                    <Skeleton className="h-9 w-12" />
                    <Skeleton className="h-9 w-12" />
                    <Skeleton className="h-9 w-12" />
                    <Skeleton className="h-9 w-12" />
                </div>

                {/* Graphique */}
                <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>

            {/* Partie droite: Formulaire et Position */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:w-[350px]">
                <div className="flex-1 sm:flex-1 lg:flex-none">
                    <Card className="w-full">
                        <CardHeader>
                            <Skeleton className="h-5 w-24" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 flex-1" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex-1 sm:flex-1 lg:flex-none">
                    <Card className="w-full">
                        <CardHeader>
                            <Skeleton className="h-5 w-24" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
