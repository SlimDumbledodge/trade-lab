"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { EmptyState } from "@/components/ui/empty-state"
import { ClipboardList, CalendarClock, Clock } from "lucide-react"
import { useInvestmentPlans } from "@/hooks/useInvestmentPlans"
import { SkeletonMarket } from "@/components/ui/skeleton-market"
import { InvestmentPlanCard } from "@/components/orders/InvestmentPlanCard"

export default function OrdersPage() {
    useEffect(() => {
        document.title = "Tradelab Studio - Ordres"
    }, [])

    const { data: session } = useSession()
    const { data: plans, isLoading } = useInvestmentPlans(session?.accessToken)
    const router = useRouter()

    if (isLoading) {
        return (
            <HomeLayout headerTitle="Ordres">
                <SkeletonMarket />
            </HomeLayout>
        )
    }

    const items = plans ?? []
    const totalAmount = items.reduce((sum, p) => sum + Number(p.amount), 0)

    return (
        <HomeLayout headerTitle="Ordres">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-500/20 ring-1 ring-blue-500/20">
                    <ClipboardList className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ordres</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Gérez vos plans d&apos;investissement programmés et ordres automatiques
                    </p>
                </div>
            </div>

            {/* Section Title */}
            <div className="mt-8">
                <div className="flex items-center gap-2 px-1 mb-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Plans d&apos;investissement programmés
                    </h2>
                    <span className="text-[10px] text-muted-foreground/60 tabular-nums">({items.length})</span>
                    <div className="flex-1 h-px bg-border/50" />
                </div>

                {items.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <EmptyState
                            title="Aucun plan d'investissement"
                            description="Créez un plan d'investissement programmé pour automatiser vos achats récurrents."
                            icons={[CalendarClock, ClipboardList, Clock]}
                            action={{
                                label: "Explorer le marché",
                                onClick: () => router.push("/market"),
                            }}
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((plan, i) => (
                            <InvestmentPlanCard
                                key={plan.id}
                                plan={plan}
                                variant="orders"
                                style={{ animationDelay: `${i * 40}ms` }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Coming soon sections */}
            <div className="mt-8 space-y-3">
                {[
                    { label: "Ordre à cours limité", description: "Bientôt disponible" },
                    { label: "Ordre stop", description: "Bientôt disponible" },
                ].map((section) => (
                    <div
                        key={section.label}
                        className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-4 opacity-50"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40 ring-1 ring-border/30">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{section.label}</p>
                            <p className="text-xs text-muted-foreground/60">{section.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </HomeLayout>
    )
}
