"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { Transaction, TransactionType } from "@/types/types"
import { TransactionTypeBadge } from "../ui/transaction-type-badge"
import Image from "next/image"

type TransactionCardProps = {
    transaction: Transaction
    className?: string
}

export function TransactionCard({ transaction, className }: TransactionCardProps) {
    const { type, quantity, price, createdAt, actif } = transaction
    const assetName = actif?.description
    console.log(price)

    const total = quantity * price

    const formattedDate = new Date(createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    const isBuy = type === TransactionType.BUY

    return (
        <div className={cn("flex justify-between items-center gap-3 rounded-xl p-3 shadow-2xs border ", className)}>
            {/* Left : Asset logo + infos */}
            <div className="flex items-center gap-3">
                <Image
                    src={"/placeholder-logo.png"}
                    alt={assetName || "Asset Logo"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border"
                />

                <div className="flex flex-col">
                    <div className="text-sm font-semibold flex items-center ">
                        {assetName}
                        <span className="ml-2">
                            <TransactionTypeBadge type={type} />
                        </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 mt-0.5">{formattedDate}</div>
                </div>
            </div>

            {/* Right : Transaction details */}
            <div className="flex flex-col text-right">
                <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Quantité : <span className="font-semibold">{quantity}</span>
                </div>
                <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Prix unitaire : <span className="font-semibold">{price} $</span>
                </div>
                <div className="text-sm font-bold mt-0.5">
                    Total :{" "}
                    <span className={isBuy ? "text-red-500" : "text-green-500"}>{isBuy ? `-${total} $` : `+${total} $`}</span>
                </div>
            </div>
        </div>
    )
}
