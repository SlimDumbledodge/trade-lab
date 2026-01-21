"use client"

import { Suspense } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TradeExecutionContent } from "./TradeExecutionContent"

import { TransactionType } from "@/types/types"

type TradeExecutionConfirmationProps = {
    transactionType: TransactionType
    nbActions: number
    open: boolean
    setOpen: (isOpen: boolean) => void
    onSuccess?: () => void
}

export const TradeExecutionConfirmation: React.FC<TradeExecutionConfirmationProps> = ({
    transactionType,
    nbActions,
    open,
    setOpen,
    onSuccess,
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Confirmation de transaction</DialogTitle>
                </DialogHeader>

                {/* Suspense boundary */}
                <Suspense fallback={<p className="text-center py-6">Chargement des informations de l’actif...</p>}>
                    <TradeExecutionContent
                        transactionType={transactionType}
                        nbActions={nbActions}
                        onSuccess={onSuccess}
                        setOpen={setOpen}
                    />
                </Suspense>
            </DialogContent>
        </Dialog>
    )
}
