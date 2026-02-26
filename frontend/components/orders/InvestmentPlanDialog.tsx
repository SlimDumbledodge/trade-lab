"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, X } from "lucide-react"
import { FrequencyType, FirstExecutionType, InvestmentPlan } from "@/types/types"
import { useCreateInvestmentPlan, useUpdateInvestmentPlan } from "@/mutations/useInvestmentPlan"
import { investmentPlanFormSchema, InvestmentPlanFormSchema } from "@/lib/validations/investment-plan-form.schema"
import toast from "react-hot-toast"
import { STEPS } from "./investment-plan/utils"
import { StepFrequency } from "./investment-plan/StepFrequency"
import { StepFirstExecution } from "./investment-plan/StepFirstExecution"
import { StepAmount } from "./investment-plan/StepAmount"
import { StepConfirmation } from "./investment-plan/StepConfirmation"

interface InvestmentPlanDialogProps {
    plan?: InvestmentPlan
    assetId?: number
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function InvestmentPlanDialog({
    plan,
    assetId,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
}: InvestmentPlanDialogProps = {}) {
    const { data: session } = useSession()
    const isEdit = !!plan
    const isControlled = controlledOpen !== undefined

    const [internalOpen, setInternalOpen] = useState(false)
    const open = isControlled ? controlledOpen : internalOpen

    const [currentStep, setCurrentStep] = useState(0)

    const form = useForm<InvestmentPlanFormSchema>({
        resolver: zodResolver(investmentPlanFormSchema),
        defaultValues: {
            assetId: plan?.assetId ?? assetId ?? 0,
            frequency: plan?.frequency ?? undefined,
            firstExecution: plan?.firstExecution ?? undefined,
            amount: plan?.amount ? Number(plan.amount) : undefined,
        },
    })

    const frequency = form.watch("frequency") as FrequencyType | undefined
    const firstExecution = form.watch("firstExecution") as FirstExecutionType | undefined
    const amount = form.watch("amount")

    const createMutation = useCreateInvestmentPlan()
    const updateMutation = useUpdateInvestmentPlan()

    const canGoNext = () => {
        switch (currentStep) {
            case 0:
                return !!frequency
            case 1:
                return !!firstExecution
            case 2:
                return amount !== undefined && amount > 0
            case 3:
                return true
            default:
                return false
        }
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((s) => s + 1)
        }
    }

    const handleSubmit = form.handleSubmit(
        (data) => {
            console.log("Form data:", data)
            const token = session?.accessToken

            if (isEdit && plan) {
                updateMutation.mutate(
                    {
                        planId: plan.id,
                        data: { frequency: data.frequency, firstExecution: data.firstExecution, amount: data.amount },
                        token,
                    },
                    {
                        onSuccess: () => {
                            toast.success("Plan d'investissement modifié")
                            handleOpenChange(false)
                        },
                        onError: () => toast.error("Erreur lors de la modification"),
                    },
                )
            } else {
                createMutation.mutate(
                    { data, token },
                    {
                        onSuccess: () => {
                            toast.success("Plan d'investissement créé")
                            handleOpenChange(false)
                        },
                        onError: () => toast.error("Erreur lors de la création"),
                    },
                )
            }
        },
        (errors) => {
            console.error("Validation errors:", errors)
            const firstError = Object.values(errors)[0]
            if (firstError?.message) {
                toast.error(firstError.message as string)
            }
        },
    )

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1)
        }
    }

    const handleOpenChange = (value: boolean) => {
        if (isControlled) {
            controlledOnOpenChange?.(value)
        } else {
            setInternalOpen(value)
        }
        if (!value) {
            setCurrentStep(0)
            form.reset({
                assetId: plan?.assetId ?? assetId ?? 0,
                frequency: plan?.frequency ?? undefined,
                firstExecution: plan?.firstExecution ?? undefined,
                amount: plan?.amount ? Number(plan.amount) : undefined,
            })
        }
    }

    const isLastStep = currentStep === STEPS.length - 1

    const dialogContent = (
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden [&>button]:hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 pt-5">
                <button
                    type="button"
                    onClick={() => (currentStep === 0 ? handleOpenChange(false) : handleBack())}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 hover:bg-muted transition-colors cursor-pointer"
                >
                    {currentStep === 0 ? (
                        <X className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>

                {/* Step indicator dots */}
                <div className="flex items-center gap-1.5">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                i === currentStep
                                    ? "w-5 bg-primary"
                                    : i < currentStep
                                      ? "w-1.5 bg-primary/50"
                                      : "w-1.5 bg-muted-foreground/20"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Step content */}
            <div className="px-6 py-8">
                {currentStep === 0 && <StepFrequency value={frequency ?? null} onChange={(v) => form.setValue("frequency", v)} />}
                {currentStep === 1 && (
                    <StepFirstExecution value={firstExecution ?? null} onChange={(v) => form.setValue("firstExecution", v)} />
                )}
                {currentStep === 2 && (
                    <StepAmount
                        value={amount ?? null}
                        onChange={(v) => form.setValue("amount", v ?? 0)}
                        frequency={frequency ?? null}
                        firstExecution={firstExecution ?? null}
                    />
                )}
                {currentStep === 3 && (
                    <StepConfirmation
                        frequency={frequency ?? null}
                        firstExecution={firstExecution ?? null}
                        amount={amount ?? null}
                        assetName={plan?.asset?.name ?? "l'actif"}
                        isEdit={isEdit}
                    />
                )}
            </div>

            {/* Bottom button */}
            <div className="px-6 pb-6">
                <Button
                    className="w-auto rounded-full px-8 font-semibold"
                    disabled={!canGoNext() || createMutation.isPending || updateMutation.isPending}
                    onClick={isLastStep ? () => handleSubmit() : handleNext}
                >
                    {isLastStep
                        ? isEdit
                            ? "Modifier le plan d'investissement"
                            : "Créer le plan d'investissement programmé"
                        : "Suivant"}
                </Button>
            </div>
        </DialogContent>
    )

    // Controlled mode (edit) — no trigger
    if (isControlled) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                {dialogContent}
            </Dialog>
        )
    }

    // Uncontrolled mode (create) — with trigger
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
                    <Plus className="h-4 w-4" />
                    Nouveau plan
                </Button>
            </DialogTrigger>
            {dialogContent}
        </Dialog>
    )
}
