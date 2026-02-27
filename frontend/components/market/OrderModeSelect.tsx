"use client"

import { useState } from "react"
import { EllipsisVertical, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export enum OrderMode {
    MARKET = "MARKET",
    LIMIT = "LIMIT",
    STOP = "STOP",
}

const ORDER_MODE_OPTIONS = [
    {
        value: OrderMode.MARKET,
        label: "Ordre au marché",
        description: "Exécution au meilleur prix",
    },
    {
        value: OrderMode.LIMIT,
        label: "Ordre à cours limité",
        description: "Exécution lorsque le prix limite est atteint ou dépassé",
    },
    {
        value: OrderMode.STOP,
        label: "Ordre stop",
        description: "Exécution lorsque le prix stop est atteint ou dépassé",
    },
]

interface OrderModeSelectProps {
    value: OrderMode
    onChange: (mode: OrderMode) => void
}

export default function OrderModeSelect({ value, onChange }: OrderModeSelectProps) {
    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <EllipsisVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                {ORDER_MODE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        className="flex items-start gap-3 cursor-pointer py-2.5"
                        onClick={() => {
                            onChange(option.value)
                            setOpen(false)
                        }}
                    >
                        <div className="flex-1">
                            <p className="font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        {value === option.value && <Check className="h-4 w-4 mt-0.5 shrink-0" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
