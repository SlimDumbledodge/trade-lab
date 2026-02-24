"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight, Target, Zap, Loader2, Pencil, Bell } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAssets } from "@/hooks/useAssets"
import { useCreateAlert } from "@/mutations/useCreateAlert"
import { useUpdateAlert } from "@/mutations/useUpdateAlert"
import { alertFormSchema, AlertFormSchema } from "@/lib/validations/create-alert-form.schema"
import { Alert } from "@/types/types"
import toast from "react-hot-toast"
import Image from "next/image"

interface AlertDialogProps {
    alert?: Alert
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function AlertDialog({ alert, open: controlledOpen, onOpenChange: controlledOnOpenChange }: AlertDialogProps) {
    const isEdit = !!alert
    const { data: session } = useSession()
    const { data: assets } = useAssets(session?.accessToken)
    const createAlertMutation = useCreateAlert()
    const updateAlertMutation = useUpdateAlert()

    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const form = useForm<AlertFormSchema>({
        resolver: zodResolver(alertFormSchema),
        defaultValues: {
            symbol: "",
            direction: "ABOVE",
            targetPrice: undefined,
        },
    })

    // Reset form values when alert changes (edit mode)
    useEffect(() => {
        if (alert && open) {
            form.reset({
                symbol: alert.config.symbol,
                direction: alert.config.direction,
                targetPrice: alert.config.targetPrice,
            })
        }
    }, [alert, open, form])

    const selectedSymbol = form.watch("symbol")
    const direction = form.watch("direction")
    const targetPrice = form.watch("targetPrice")
    const selectedAsset = assets?.find((a) => a.symbol === selectedSymbol)

    const isPending = createAlertMutation.isPending || updateAlertMutation.isPending

    const handleOpenChange = (value: boolean) => {
        if (isControlled) {
            controlledOnOpenChange?.(value)
        } else {
            setInternalOpen(value)
        }
        if (!value) form.reset({ symbol: "", direction: "ABOVE", targetPrice: undefined })
    }

    const onSubmit = (data: AlertFormSchema) => {
        if (isEdit) {
            updateAlertMutation.mutate(
                {
                    alertId: alert.id,
                    data: {
                        config: {
                            symbol: data.symbol,
                            targetPrice: data.targetPrice,
                            direction: data.direction,
                        },
                    },
                    token: session?.accessToken,
                },
                {
                    onSuccess: () => {
                        toast.success("Alerte modifiée avec succès")
                        handleOpenChange(false)
                    },
                    onError: () => {
                        toast.error("Erreur lors de la modification de l'alerte")
                    },
                },
            )
        } else {
            createAlertMutation.mutate(
                { data, token: session?.accessToken },
                {
                    onSuccess: () => {
                        toast.success("Alerte créée avec succès")
                        handleOpenChange(false)
                    },
                    onError: () => {
                        toast.error("Erreur lors de la création de l'alerte")
                    },
                },
            )
        }
    }

    const dialogContent = (
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-0">
                <DialogTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-indigo-500/10 ring-1 ring-violet-500/20">
                        {isEdit ? <Pencil className="h-4 w-4 text-violet-500" /> : <Zap className="h-4 w-4 text-violet-500" />}
                    </div>
                    {isEdit ? "Modifier l'alerte" : "Créer une alerte"}
                </DialogTitle>
                <DialogDescription>
                    {isEdit
                        ? "Modifiez les paramètres de votre alerte."
                        : "Recevez une notification lorsque le prix atteint votre cible."}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="px-6 py-5 space-y-5">
                    {/* Asset selector */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actif</Label>

                        <Select
                            value={selectedSymbol ?? ""}
                            onValueChange={(value) => form.setValue("symbol", value, { shouldValidate: true })}
                        >
                            <SelectTrigger
                                className={`w-full h-10 rounded-lg ${form.formState.errors.symbol ? "border-red-500" : ""}`}
                            >
                                <SelectValue placeholder="Sélectionner un actif" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[240px]">
                                {assets?.map((asset) => (
                                    <SelectItem key={asset.id} value={asset.symbol}>
                                        <div className="flex items-center gap-2.5">
                                            <Image
                                                src={asset.logo}
                                                alt={asset.symbol}
                                                width={20}
                                                height={20}
                                                className="rounded shrink-0 ring-1 ring-border/50"
                                            />
                                            <span className="font-medium">{asset.name}</span>
                                            <span className="text-muted-foreground text-xs">{asset.symbol}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedAsset && (
                            <p className="text-[11px] text-muted-foreground">
                                Prix actuel : {Number(selectedAsset.lastPrice).toFixed(2)} €
                            </p>
                        )}
                        {form.formState.errors.symbol && (
                            <p className="text-[11px] text-red-500">{form.formState.errors.symbol.message}</p>
                        )}
                    </div>

                    {/* Direction selector */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Condition</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => form.setValue("direction", "ABOVE")}
                                className={`group relative flex items-center gap-2.5 rounded-xl border p-3 transition-all duration-200 cursor-pointer
                                ${
                                    direction === "ABOVE"
                                        ? "border-green-500/30 bg-green-500/5 shadow-sm shadow-green-500/5"
                                        : "border-border/50 hover:border-border hover:bg-muted/30"
                                }
                            `}
                            >
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors
                                ${
                                    direction === "ABOVE"
                                        ? "bg-green-500/15 ring-1 ring-green-500/25"
                                        : "bg-muted ring-1 ring-border/50"
                                }
                            `}
                                >
                                    <ArrowUpRight
                                        className={`h-4 w-4 ${direction === "ABOVE" ? "text-green-500" : "text-muted-foreground"}`}
                                    />
                                </div>
                                <div>
                                    <p
                                        className={`text-sm font-semibold ${direction === "ABOVE" ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
                                    >
                                        Au-dessus
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">Prix dépasse la cible</p>
                                </div>
                                {direction === "ABOVE" && (
                                    <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-green-500/0 via-green-500/60 to-green-500/0" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => form.setValue("direction", "BELOW")}
                                className={`group relative flex items-center gap-2.5 rounded-xl border p-3 transition-all duration-200 cursor-pointer
                                ${
                                    direction === "BELOW"
                                        ? "border-red-500/30 bg-red-500/5 shadow-sm shadow-red-500/5"
                                        : "border-border/50 hover:border-border hover:bg-muted/30"
                                }
                            `}
                            >
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors
                                ${
                                    direction === "BELOW"
                                        ? "bg-red-500/15 ring-1 ring-red-500/25"
                                        : "bg-muted ring-1 ring-border/50"
                                }
                            `}
                                >
                                    <ArrowDownRight
                                        className={`h-4 w-4 ${direction === "BELOW" ? "text-red-500" : "text-muted-foreground"}`}
                                    />
                                </div>
                                <div>
                                    <p
                                        className={`text-sm font-semibold ${direction === "BELOW" ? "text-red-600 dark:text-red-400" : "text-foreground"}`}
                                    >
                                        En-dessous
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">Prix chute sous la cible</p>
                                </div>
                                {direction === "BELOW" && (
                                    <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-red-500/0 via-red-500/60 to-red-500/0" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Target price */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prix cible</Label>
                        <div className="relative">
                            <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={targetPrice ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value
                                    form.setValue(
                                        "targetPrice",
                                        val === "" ? (undefined as unknown as number) : parseFloat(val),
                                        { shouldValidate: true },
                                    )
                                }}
                                className={`pl-9 pr-8 h-10 rounded-lg text-sm tabular-nums ${form.formState.errors.targetPrice ? "border-red-500" : ""}`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                                €
                            </span>
                        </div>
                        {selectedAsset && targetPrice && (
                            <p className="text-[11px] text-muted-foreground">
                                Prix actuel : {Number(selectedAsset.lastPrice).toFixed(2)} € · {direction === "ABOVE" ? "+" : ""}
                                {((Number(targetPrice) / Number(selectedAsset.lastPrice) - 1) * 100).toFixed(2)}% par rapport au
                                prix actuel
                            </p>
                        )}
                        {form.formState.errors.targetPrice && (
                            <p className="text-[11px] text-red-500">{form.formState.errors.targetPrice.message}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/20">
                    <Button type="button" variant="outline" className="rounded-lg" onClick={() => handleOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-lg gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-sm"
                    >
                        {isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isEdit ? (
                            <Pencil className="h-3.5 w-3.5" />
                        ) : (
                            <Zap className="h-3.5 w-3.5" />
                        )}
                        {isPending
                            ? isEdit
                                ? "Modification..."
                                : "Création..."
                            : isEdit
                              ? "Modifier l'alerte"
                              : "Créer l'alerte"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )

    // En mode edit (contrôlé), pas de trigger
    if (isControlled) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                {dialogContent}
            </Dialog>
        )
    }

    // En mode create, avec trigger intégré
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
                    <Bell className="h-4 w-4" />
                    Nouvelle alerte
                </Button>
            </DialogTrigger>
            {dialogContent}
        </Dialog>
    )
}
