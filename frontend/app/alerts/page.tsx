"use client"

import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bell, BellRing, BellOff, Zap, Trash2, Activity, ArrowUpRight, ArrowDownRight, Pencil, MoreVertical } from "lucide-react"
import { useAlerts } from "@/hooks/useAlerts"
import { SkeletonMarket } from "@/components/ui/skeleton-market"
import { Alert, AlertStatus } from "@/types/types"
import { AlertDialog } from "@/components/alerts/AlertDialog"
import { deleteAlert, updateAlert } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

/* ─────────────── AlertCard ─────────────── */

function AlertCard({
    alert,
    index,
    onDelete,
    onEdit,
    onToggle,
    onClick,
}: {
    alert: Alert
    index: number
    onDelete: (id: number) => void
    onEdit: (alert: Alert) => void
    onToggle: (alert: Alert) => void
    onClick: (symbol: string) => void
}) {
    const config = alert.config
    const isAbove = config.direction === "ABOVE"
    const isTriggered = alert.status === AlertStatus.TRIGGERED
    const isActive = alert.status === AlertStatus.ACTIVE

    return (
        <div
            className={`group flex items-center gap-3 sm:gap-4 rounded-xl border p-3 transition-all cursor-pointer backdrop-blur-sm
                ${isActive ? "border-border/50 bg-card/60 hover:border-primary/20 hover:shadow-sm" : ""}
                ${isTriggered ? "border-border/50 bg-card/60 hover:border-amber-500/20 hover:shadow-sm" : ""}
                ${!isActive && !isTriggered ? "border-border/40 bg-card/40 opacity-60 hover:opacity-80 hover:border-border/60 hover:shadow-sm" : ""}
            `}
            style={{ animationDelay: `${index * 40}ms` }}
            onClick={() => onClick(config.symbol)}
        >
            {/* Direction icon */}
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1
                    ${isAbove ? "bg-green-500/10 ring-green-500/20" : "bg-red-500/10 ring-red-500/20"}
                `}
            >
                {isAbove ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{config.symbol}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                        {alert.triggeredAt
                            ? new Date(alert.triggeredAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : new Date(alert.createdAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                              })}
                    </span>
                </div>
            </div>

            {/* Target price */}
            <div className="flex flex-col items-end gap-0.5 shrink-0">
                <p className="font-bold text-sm tabular-nums">{config.targetPrice.toFixed(2)} €</p>
                <span className="text-[10px] text-muted-foreground">Prix cible</span>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-0.5 shrink-0">
                {!isTriggered && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                            isActive
                                ? "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                                : "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10"
                        }`}
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggle(alert)
                        }}
                    >
                        {isActive ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                    </Button>
                )}
                {!isTriggered && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(alert)
                        }}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(alert.id)
                    }}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Mobile actions */}
            <div className="sm:hidden shrink-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        {!isTriggered && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onToggle(alert)
                                }}
                            >
                                {isActive ? (
                                    <>
                                        <BellOff className="h-4 w-4 mr-2 text-amber-500" />
                                        Désactiver
                                    </>
                                ) : (
                                    <>
                                        <Bell className="h-4 w-4 mr-2 text-emerald-500" />
                                        Réactiver
                                    </>
                                )}
                            </DropdownMenuItem>
                        )}
                        {!isTriggered && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(alert)
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2 text-violet-500" />
                                Modifier
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(alert.id)
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

/* ─────────────── AlertSection ─────────────── */

function AlertSection({
    alerts,
    label,
    dotClass,
    onDelete,
    onEdit,
    onToggle,
    onClick,
}: {
    alerts: Alert[]
    label: string
    dotClass: string
    onDelete: (id: number) => void
    onEdit: (alert: Alert) => void
    onToggle: (alert: Alert) => void
    onClick: (symbol: string) => void
}) {
    if (alerts.length === 0) return null

    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
                <div className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h2>
                <span className="text-[10px] text-muted-foreground/60 tabular-nums">({alerts.length})</span>
                <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="space-y-2">
                {alerts.map((alert, i) => (
                    <AlertCard
                        key={alert.id}
                        alert={alert}
                        index={i}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onToggle={onToggle}
                        onClick={onClick}
                    />
                ))}
            </div>
        </section>
    )
}

/* ─────────────── Main Page ─────────────── */

export default function AlertsPage() {
    useEffect(() => {
        document.title = "Tradelab Studio - Alertes"
    }, [])

    const { data: session } = useSession()
    const { data: alerts, isLoading } = useAlerts(session?.accessToken)
    const queryClient = useQueryClient()
    const router = useRouter()

    const [editingAlert, setEditingAlert] = useState<Alert | null>(null)

    const handleDelete = async (alertId: number) => {
        try {
            await deleteAlert(alertId, session?.accessToken)
            queryClient.invalidateQueries({ queryKey: ["alerts"] })
            toast.success("Alerte supprimée")
        } catch {
            toast.error("Erreur lors de la suppression")
        }
    }

    const handleToggle = async (alert: Alert) => {
        const newStatus = alert.status === AlertStatus.ACTIVE ? "DISABLED" : "ACTIVE"
        try {
            await updateAlert(alert.id, { status: newStatus }, session?.accessToken)
            queryClient.invalidateQueries({ queryKey: ["alerts"] })
            toast.success(newStatus === "ACTIVE" ? "Alerte réactivée" : "Alerte désactivée")
        } catch {
            toast.error("Erreur lors de la modification du statut")
        }
    }

    const items = alerts ?? []
    const activeAlerts = useMemo(() => items.filter((a) => a.status === AlertStatus.ACTIVE), [items])
    const triggeredAlerts = useMemo(() => items.filter((a) => a.status === AlertStatus.TRIGGERED), [items])
    const disabledAlerts = useMemo(() => items.filter((a) => a.status === AlertStatus.DISABLED), [items])

    if (isLoading) {
        return (
            <HomeLayout headerTitle="Alertes">
                <SkeletonMarket />
            </HomeLayout>
        )
    }

    return (
        <HomeLayout headerTitle="Alertes">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400/20 to-indigo-500/20 ring-1 ring-violet-500/20">
                        <Bell className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mes Alertes</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Soyez notifié quand un actif atteint votre prix cible
                        </p>
                    </div>
                </div>
                <AlertDialog />
            </div>

            {/* Stats Cards */}
            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
                {[
                    {
                        label: "Total",
                        value: items.length,
                        icon: Activity,
                        iconColor: "text-violet-500",
                        hoverBorder: "hover:border-primary/20",
                        textColor: "",
                    },
                    {
                        label: "Actives",
                        value: activeAlerts.length,
                        icon: Bell,
                        iconColor: "text-emerald-500",
                        hoverBorder: "hover:border-emerald-500/20",
                        textColor: "text-emerald-600 dark:text-emerald-400",
                    },
                    {
                        label: "Déclenchées",
                        value: triggeredAlerts.length,
                        icon: BellRing,
                        iconColor: "text-amber-500",
                        hoverBorder: "hover:border-amber-500/20",
                        textColor: "text-amber-600 dark:text-amber-400",
                    },
                    {
                        label: "Désactivées",
                        value: disabledAlerts.length,
                        icon: BellOff,
                        iconColor: "text-zinc-400",
                        hoverBorder: "hover:border-zinc-500/20",
                        textColor: "text-zinc-500 dark:text-zinc-400",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className={`group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 transition-all ${stat.hoverBorder} hover:shadow-sm`}
                    >
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
                            <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
                            {stat.label}
                        </div>
                        <p className={`mt-1 text-lg sm:text-xl font-bold tabular-nums ${stat.textColor}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="mt-6 sm:mt-8">
                {items.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <EmptyState
                            title="Aucune alerte configurée"
                            description="Créez des alertes de prix depuis la page d'un actif pour être notifié automatiquement."
                            icons={[Bell, Zap, BellRing]}
                            action={{
                                label: "Explorer le marché",
                                onClick: () => router.push("/market"),
                            }}
                        />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <AlertSection
                            alerts={activeAlerts}
                            label="En surveillance"
                            dotClass="bg-emerald-500 animate-pulse"
                            onDelete={handleDelete}
                            onEdit={setEditingAlert}
                            onToggle={handleToggle}
                            onClick={(symbol) => router.push(`/market/${symbol}`)}
                        />
                        <AlertSection
                            alerts={triggeredAlerts}
                            label="Déclenchées"
                            dotClass="bg-amber-500"
                            onDelete={handleDelete}
                            onEdit={setEditingAlert}
                            onToggle={handleToggle}
                            onClick={(symbol) => router.push(`/market/${symbol}`)}
                        />
                        <AlertSection
                            alerts={disabledAlerts}
                            label="Désactivées"
                            dotClass="bg-zinc-400"
                            onDelete={handleDelete}
                            onEdit={setEditingAlert}
                            onToggle={handleToggle}
                            onClick={(symbol) => router.push(`/market/${symbol}`)}
                        />
                    </div>
                )}
            </div>

            {/* Capacity Indicator */}
            {items.length > 0 && (
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/40 bg-muted/20 backdrop-blur-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-violet-500" />
                        <span className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{activeAlerts.length}</span>/20 alertes actives
                        </span>
                    </div>
                    <div className="h-2 w-full sm:w-36 rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700 ease-out"
                            style={{ width: `${Math.min((activeAlerts.length / 20) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <AlertDialog
                alert={editingAlert ?? undefined}
                open={!!editingAlert}
                onOpenChange={(open) => {
                    if (!open) setEditingAlert(null)
                }}
            />
        </HomeLayout>
    )
}
