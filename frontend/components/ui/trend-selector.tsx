"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type TrendOption = {
    label: string
    value: string
    group: string
}

const defaultOptions: TrendOption[] = [
    { label: "Tendance quotidienne (%)", value: "daily_pct", group: "Aujourd'hui" },
    { label: "Tendance quotidienne (€)", value: "daily_eur", group: "Aujourd'hui" },
    { label: "Depuis l'achat (%)", value: "since_buy_pct", group: "Depuis l'achat" },
    { label: "Depuis l'achat (€)", value: "since_buy_eur", group: "Depuis l'achat" },
]

type TrendSelectorProps = {
    value: string
    onValueChange: (value: string) => void
}

export const TrendSelector: React.FC<TrendSelectorProps> = ({ value, onValueChange }) => {
    const selectedOption = defaultOptions.find((o) => o.value === value) ?? defaultOptions[0]
    const triggerLabel = selectedOption?.group ?? "Aujourd'hui"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="link" className="no-underline hover:no-underline" size="sm">
                    {triggerLabel}
                    <ChevronDown className="size-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                    {defaultOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onSelect={() => onValueChange?.(option.value)}
                            className={cn(
                                "cursor-pointer",
                                option.value === selectedOption?.value && "font-semibold text-foreground",
                            )}
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
