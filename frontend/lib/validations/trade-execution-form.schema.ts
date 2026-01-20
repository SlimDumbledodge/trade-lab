import { FormMode } from "@/components/market/TradeExecutionForm"
import { TransactionType } from "@/types/types"
import { z } from "zod"

export const createTradeFormSchema = (
    transactionType: TransactionType,
    formMode: FormMode,
    cashBalance: number,
    lastPrice: number,
    portfolioAssetQuantity: number,
) =>
    z
        .object({
            montant: z
                .string()
                .optional()
                .refine((val) => !val || Number(val) > 0, {
                    message: "Le montant doit être supérieur à 0",
                }),
            nbActions: z
                .string()
                .optional()
                .refine((val) => !val || Number(val) > 0, {
                    message: "Le nombre d’actions doit être supérieur à 0",
                }),
        })
        .superRefine((data, ctx) => {
            if (formMode === FormMode.MONTANT) {
                const montant = Number(data.montant)

                if (!data.montant || isNaN(montant) || montant <= 0) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["montant"],
                        message: "Veuillez saisir un montant valide supérieur à 0",
                    })
                } else if (transactionType === TransactionType.BUY && montant > cashBalance) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["montant"],
                        message: "Montant supérieur au solde disponible",
                    })
                } else if (transactionType === TransactionType.SELL) {
                    const montantMax = portfolioAssetQuantity * lastPrice
                    if (montant > montantMax) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["montant"],
                            message: "Montant supérieur à la valeur de vos actions disponibles",
                        })
                    }
                }
            }

            if (formMode === FormMode.AUMARCHE) {
                const nbActions = Number(data.nbActions)
                const montantTotal = nbActions * lastPrice

                if (!data.nbActions || isNaN(nbActions) || nbActions <= 0) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["nbActions"],
                        message: "Veuillez saisir un nombre d'actions valide supérieur à 0",
                    })
                } else if (transactionType === TransactionType.BUY && montantTotal > cashBalance) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["nbActions"],
                        message: "Montant total supérieur au solde disponible",
                    })
                } else if (transactionType === TransactionType.SELL && nbActions > portfolioAssetQuantity) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["nbActions"],
                        message: "Nombre d'actions supérieur à vos actions disponibles",
                    })
                }
            }
        })

export type TradeFormSchema = z.infer<ReturnType<typeof createTradeFormSchema>>
