import { FrequencyType } from "@/types/types"
import { frequencyOptions } from "./utils"

interface StepFrequencyProps {
    value: FrequencyType | null
    onChange: (v: FrequencyType) => void
}

export function StepFrequency({ value, onChange }: StepFrequencyProps) {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                À quelle fréquence doit-il être exécuté ?
            </h2>

            <div className="flex flex-col gap-1">
                {frequencyOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className="flex items-center justify-between gap-4 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:bg-muted/40"
                    >
                        <div className="text-left">
                            <p className="text-sm font-semibold">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        <div
                            className={`h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                ${value === option.value ? "border-primary bg-primary" : "border-muted-foreground/30"}
                            `}
                        >
                            {value === option.value && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
