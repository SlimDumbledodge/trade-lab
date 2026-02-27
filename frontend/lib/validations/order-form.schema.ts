import { OrderExpiresType, TransactionType } from "@/types/types"
import { z } from "zod"

export const createOrderFormSchema = (
    transactionType: TransactionType,
    cashBalance: number,
    lastPrice: number,
    portfolioAssetQuantity: number,
) =>
    z
        .object({
            quantity: z.string().min(1, "Veuillez saisir une quantité"),
            targetPrice: z.string().min(1, "Veuillez saisir un prix cible"),
            expiresType: z.nativeEnum(OrderExpiresType),
        })
        .superRefine((data, ctx) => {
            const quantity = Number(data.quantity)
            const targetPrice = Number(data.targetPrice)

            if (isNaN(quantity) || quantity <= 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["quantity"],
                    message: "La quantité doit être supérieure à 0",
                })
                return
            }

            if (isNaN(targetPrice) || targetPrice <= 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["targetPrice"],
                    message: "Le prix cible doit être supérieur à 0",
                })
                return
            }

            const estimatedAmount = quantity * targetPrice

            if (transactionType === TransactionType.BUY && estimatedAmount > cashBalance) {
                ctx.addIssue({
                    code: "custom",
                    path: ["quantity"],
                    message: "Montant estimé supérieur au solde disponible",
                })
            }

            if (transactionType === TransactionType.SELL && quantity > portfolioAssetQuantity) {
                ctx.addIssue({
                    code: "custom",
                    path: ["quantity"],
                    message: "Quantité supérieure à vos actions disponibles",
                })
            }
        })

export type OrderFormSchema = z.infer<ReturnType<typeof createOrderFormSchema>>
