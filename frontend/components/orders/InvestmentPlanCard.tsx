"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { CountdownCircle, getDaysUntil, getDaysUntilFirstExecution } from "@/components/orders/CountdownCircle"
import { FrequencyType, InvestmentPlan } from "@/types/types"
import { InvestmentPlanDialog } from "@/components/orders/InvestmentPlanDialog"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { useDeleteInvestmentPlan } from "@/mutations/useInvestmentPlan"
import toast from "react-hot-toast"

export const frequencyLabels: Record<FrequencyType, string> = {
    [FrequencyType.WEEKLY]: "Chaque semaine",
    [FrequencyType.TWICE_BY_MONTH]: "2 fois par mois",
    [FrequencyType.MONTHLY]: "Chaque mois",
    [FrequencyType.QUARTERLY]: "Chaque trimestre",
}

interface InvestmentPlanCardProps {
    plan?: InvestmentPlan | null
    assetId?: number
    variant?: "market" | "orders"
    style?: React.CSSProperties
}

export function InvestmentPlanCard({ plan, assetId, variant = "market", style }: InvestmentPlanCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const { data: session } = useSession()
    const deletePlan = useDeleteInvestmentPlan()

    const handleDelete = (planId: number) => {
        deletePlan.mutate(
            { planId, token: session?.accessToken },
            {
                onSuccess: () => toast.success("Plan d'investissement supprimé"),
                onError: () => toast.error("Erreur lors de la suppression"),
            },
        )
    }

    // État vide : carte promotionnelle (uniquement sur market)
    if (!plan && variant === "market") {
        return (
            <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-semibold leading-snug">
                        Investissez régulièrement quelques euros et faites travailler votre argent.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Le plan d&apos;épargne est gratuit pour toujours. Vous pouvez le modifier ou le supprimer à tout moment.
                    </p>
                </div>
                <InvestmentPlanDialog assetId={assetId} />
            </div>
        )
    }

    if (!plan) return null

    const daysUntil = plan.nextExecutionAt
        ? getDaysUntil(plan.nextExecutionAt)
        : plan.isFirstExecution
          ? getDaysUntilFirstExecution(plan.firstExecution)
          : null

    const handleClick = () => {
        setEditOpen(true)
    }

    const planCard = (
        <div
            className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 cursor-pointer transition-all hover:border-primary/20 hover:shadow-sm"
            style={style}
            onClick={handleClick}
        >
            <CountdownCircle daysUntil={daysUntil} frequency={plan.frequency} />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{variant === "orders" ? plan.asset.name : "Prochaine exécution"}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                        {frequencyLabels[plan.frequency]}
                    </Badge>
                    <span className="text-sm font-bold tabular-nums">{Number(plan.amount).toFixed(0)} €</span>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(plan.id)
                }}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    )

    if (variant === "orders") {
        return (
            <>
                {planCard}
                <InvestmentPlanDialog plan={plan} open={editOpen} onOpenChange={setEditOpen} />
            </>
        )
    }

    // Variant "market" : titre externe + dialog édition
    return (
        <>
            <div className="space-y-3">
                <h3 className="text-sm font-semibold">Plan d&apos;investissement programmé</h3>
                {planCard}
            </div>

            <InvestmentPlanDialog plan={plan} open={editOpen} onOpenChange={setEditOpen} />
        </>
    )
}
