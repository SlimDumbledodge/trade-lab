"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/usePortfolio"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPage() {
    useEffect(() => {
        document.title = "Tradelab Studio | Mon compte"
    }, [])

    const { data: session } = useSession()
    const { data: portfolio, isLoading } = usePortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, session?.accessToken)

    return (
        <HomeLayout headerTitle="Mon compte">
            <div className="w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du compte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Nom d'utilisateur */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</label>
                            <p className="text-lg font-semibold">{session?.user?.name || "Non disponible"}</p>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-lg font-semibold">{session?.user?.email || "Non disponible"}</p>
                        </div>

                        {/* Solde disponible */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Solde disponible</label>
                            {isLoading ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <p className="text-lg font-semibold">
                                    {portfolio?.cashBalance ? `${Number(portfolio.cashBalance).toFixed(2)} €` : "0.00 €"}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </HomeLayout>
    )
}
