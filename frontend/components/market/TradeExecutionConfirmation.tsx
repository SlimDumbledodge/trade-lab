import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAsset } from "@/hooks/useAsset"
import { useTradeExecution } from "@/mutations/useTradeExecution"
import { TransactionType } from "@/types/types"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"

type TradeExecutionConfirmation = {
    transactionType: TransactionType
    nbActions: number
    open: boolean
    setOpen: (isOpen: boolean) => void
}

export const TradeExecutionConfirmation: React.FC<TradeExecutionConfirmation> = (props) => {
    const params = useParams()
    const symbol = params?.symbol as string
    const { transactionType, nbActions, open, setOpen } = props
    const { data: session } = useSession()
    const { data: asset, isLoading: isAssetLoading, error: assetError } = useAsset(symbol, session?.accessToken)
    const { mutateAsync: processTradeExecution, isPending: isTradeExecutionLoading } = useTradeExecution()

    if (isAssetLoading) return <p>Chargement...</p>
    if (assetError) return <p className="text-red-600">{assetError?.message}</p>
    if (!asset) return <p>Erreur : aucun actif trouvé.</p>
    const formattedNbActions = nbActions.toFixed(6)
    const montantIndicatif = Number(formattedNbActions) * Number(asset.lastPrice)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>
                        Vous {transactionType === TransactionType.BUY ? "Achetez" : "Vendez"} {formattedNbActions} x {asset.name}{" "}
                        pour {Number(asset.lastPrice)}€ chacune.
                    </DialogTitle>
                </DialogHeader>
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
                    {/* <p className="text-xs text-muted-foreground">
                        Vous trouverez les{" "}
                        <a href="#" className="text-blue-500 hover:underline">
                            informations sur les coûts
                        </a>{" "}
                        ici.
                    </p> */}
                </div>
                <Button
                    className="w-full"
                    onClick={() => {
                        setOpen(false)
                        toast.promise(
                            Promise.all([
                                processTradeExecution({
                                    transactionType,
                                    assetId: asset.id,
                                    quantity: nbActions,
                                    token: session?.accessToken,
                                }),
                                new Promise((resolve) => setTimeout(resolve, 800)),
                            ]).then(([result]) => result),
                            {
                                loading: "Transaction en cours...",
                                success: "Transaction exécutée avec succès !",
                                error: "Erreur lors de la transaction.",
                            },
                        )
                    }}
                    disabled={isTradeExecutionLoading}
                >
                    {transactionType === TransactionType.BUY ? "Acheter maintenant" : "Vendre maintenant"}
                </Button>
                <p className="text-xs text-center text-muted-foreground px-4">
                    Par la présente, je donne instruction à TradeLab de placer mon ordre à TradeLab.
                </p>
            </DialogContent>
        </Dialog>
    )
}
