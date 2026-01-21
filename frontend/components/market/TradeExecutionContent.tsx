"use client"

import { Button } from "@/components/ui/button"
import { useAsset } from "@/hooks/useAsset"
import { useTradeExecution } from "@/mutations/useTradeExecution"
import { TransactionType } from "@/types/types"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"

type TradeExecutionContentProps = {
    transactionType: TransactionType
    nbActions: number
    setOpen: (isOpen: boolean) => void
    onSuccess?: () => void
}

export const TradeExecutionContent: React.FC<TradeExecutionContentProps> = ({
    transactionType,
    nbActions,
    setOpen,
    onSuccess,
}) => {
    const params = useParams()
    const symbol = params?.symbol as string
    const { data: session } = useSession()
    const { data: asset, error: errorAsset } = useAsset(symbol, session?.accessToken) // Suspense active ici
    const { mutateAsync: processTradeExecution, isPending: isTradeExecutionLoading } = useTradeExecution()

    if (!asset) {
        return <p className="text-center py-8">Erreur : aucun actif trouvé.</p>
    }

    const formattedNbActions = nbActions.toFixed(6)
    const montantIndicatif = Number(formattedNbActions) * Number(asset.lastPrice)

    const handleConfirm = async () => {
        setOpen(false)
        toast.promise(
            processTradeExecution({
                transactionType,
                assetId: asset.id,
                quantity: nbActions,
                token: session?.accessToken,
            }).then((result) => {
                onSuccess?.()
                return result
            }),
            {
                loading: "Transaction en cours...",
                success: "Transaction exécutée avec succès !",
                error: "Erreur lors de la transaction.",
            },
        )
    }

    return (
        <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                    Ordre {transactionType === TransactionType.BUY ? "d'achat" : "de vente"} au marché
                </span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Actions</span>
                <span className="font-medium">{formattedNbActions}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prix du marché</span>
                <span className="font-medium">{Number(asset.lastPrice)} €</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Montant (indicatif)</span>
                <span className="font-medium">{montantIndicatif.toFixed(2)} €</span>
            </div>

            <p className="text-xs text-muted-foreground">Le prix du marché est à titre indicatif.</p>

            <Button className="w-full" onClick={handleConfirm} disabled={isTradeExecutionLoading}>
                {transactionType === TransactionType.BUY ? "Acheter maintenant" : "Vendre maintenant"}
            </Button>

            <p className="text-xs text-center text-muted-foreground px-4">
                Par la présente, je donne instruction à TradeLab de placer mon ordre à TradeLab.
            </p>
        </div>
    )
}
