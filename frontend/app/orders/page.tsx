"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { EmptyState } from "@/components/ui/empty-state"
import { ClipboardList, CalendarClock, Clock, Target } from "lucide-react"
import { useInvestmentPlans } from "@/hooks/useInvestmentPlans"
import { useAllOrders } from "@/hooks/useAllOrders"
import { useDeleteOrder } from "@/mutations/useOrder"
import { SkeletonMarket } from "@/components/ui/skeleton-market"
import { InvestmentPlanCard } from "@/components/orders/InvestmentPlanCard"
import { PendingOrderRow } from "@/components/orders/PendingOrderRow"
import toast from "react-hot-toast"

export default function OrdersPage() {
    useEffect(() => {
        document.title = "Tradelab Studio - Ordres"
    }, [])

    const { data: session } = useSession()
    const { data: plans, isLoading: plansLoading } = useInvestmentPlans(session?.accessToken)
    const { data: orders, isLoading: ordersLoading } = useAllOrders(session?.accessToken)
    const deleteOrder = useDeleteOrder()
    const router = useRouter()

    const isLoading = plansLoading || ordersLoading

    if (isLoading) {
        return (
            <HomeLayout headerTitle="Ordres">
                <SkeletonMarket />
            </HomeLayout>
        )
    }

    const investmentPlans = plans ?? []
    const pendingOrders = orders ?? []

    const handleDeleteOrder = (orderId: number) => {
        deleteOrder.mutate(
            { orderId, token: session?.accessToken },
            {
                onSuccess: () => toast.success("Ordre annulé"),
                onError: () => toast.error("Erreur lors de l'annulation"),
            },
        )
    }

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

            {/* Section: Ordres en attente */}
            <div className="mt-8">
                <div className="flex items-center gap-2 px-1 mb-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ordres en attente</h2>
                    <span className="text-[10px] text-muted-foreground/60 tabular-nums">({pendingOrders.length})</span>
                    <div className="flex-1 h-px bg-border/50" />
                </div>

                {pendingOrders.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <EmptyState
                            title="Aucun ordre en attente"
                            description="Créez un ordre limite ou stop depuis la page d'un actif pour automatiser vos échanges."
                            icons={[Target, ClipboardList, Clock]}
                            action={{
                                label: "Explorer le marché",
                                onClick: () => router.push("/market"),
                            }}
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        {pendingOrders.map((order, i) => (
                            <PendingOrderRow
                                key={order.id}
                                order={order}
                                onDelete={handleDeleteOrder}
                                showAsset
                                style={{ animationDelay: `${i * 40}ms` }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Section: Plans d'investissement programmés */}
            <div className="mt-8">
                <div className="flex items-center gap-2 px-1 mb-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Plans d&apos;investissement programmés
                    </h2>
                    <span className="text-[10px] text-muted-foreground/60 tabular-nums">({investmentPlans.length})</span>
                    <div className="flex-1 h-px bg-border/50" />
                </div>

                {investmentPlans.length === 0 ? (
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
                        {investmentPlans.map((plan, i) => (
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
        </HomeLayout>
    )
}
