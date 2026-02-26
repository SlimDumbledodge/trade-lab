import { Separator } from "@/components/ui/separator"
import { FrequencyType, FirstExecutionType } from "@/types/types"
import { frequencyLabels, getFirstExecutionShortDate } from "./utils"

interface StepConfirmationProps {
    frequency: FrequencyType | null
    firstExecution: FirstExecutionType | null
    amount: number | null
    assetName: string
    isEdit?: boolean
}

export function StepConfirmation({ frequency, firstExecution, amount, assetName }: StepConfirmationProps) {
    const frequencyLabel = frequency ? frequencyLabels[frequency].toLowerCase() : "—"
    const dateLabel = firstExecution ? getFirstExecutionShortDate(firstExecution) : "—"

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Vous investissez {amount ?? 0} € {frequencyLabel} avec {assetName}.
            </h2>

            <div className="space-y-0">
                {[
                    { label: "Type", value: "Plan d'investissement programmé" },
                    { label: "Montant", value: `${amount ?? 0} €` },
                    { label: "Intervalle", value: frequency ? frequencyLabels[frequency] : "—" },
                    { label: "Date de début", value: dateLabel },
                ].map((row, i, arr) => (
                    <div key={row.label}>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-sm text-muted-foreground">{row.label}</span>
                            <span className="text-sm font-semibold text-right">{row.value}</span>
                        </div>
                        {i < arr.length - 1 && <Separator className="opacity-30" />}
                    </div>
                ))}
            </div>
        </div>
    )
}
