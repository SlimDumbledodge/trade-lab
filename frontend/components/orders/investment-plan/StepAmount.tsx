import { Input } from "@/components/ui/input"
import { FrequencyType, FirstExecutionType } from "@/types/types"
import { frequencyLabels, getFirstExecutionShortDate } from "./utils"

interface StepAmountProps {
    value: number | null
    onChange: (v: number | null) => void
    frequency: FrequencyType | null
    firstExecution: FirstExecutionType | null
}

export function StepAmount({ value, onChange, frequency, firstExecution }: StepAmountProps) {
    const summary = [
        frequency ? frequencyLabels[frequency] : "",
        firstExecution ? `commençant le ${getFirstExecutionShortDate(firstExecution)}` : "",
    ]
        .filter(Boolean)
        .join(", ")

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Quel montant souhaitez-vous investir ?
            </h2>

            <div>
                <div className="flex items-baseline gap-2 rounded-xl bg-muted/40 p-4">
                    <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="0"
                        value={value ?? ""}
                        onChange={(e) => {
                            const val = e.target.value
                            onChange(val === "" ? null : parseFloat(val))
                        }}
                        className="border-none bg-transparent text-4xl font-extrabold p-0 h-auto focus-visible:ring-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-2xl font-semibold text-muted-foreground">€</span>
                </div>
                {summary && <p className="text-xs text-amber-500 mt-2 px-1">{summary}</p>}
            </div>
        </div>
    )
}
