import { z } from "zod"

export const investmentPlanFormSchema = z.object({
    assetId: z.number({ message: "L'actif est requis" }).int().positive("L'ID de l'actif doit être positif"),
    frequency: z.enum(["WEEKLY", "TWICE_BY_MONTH", "MONTHLY", "QUARTERLY"], {
        message: "La fréquence est requise",
    }),
    firstExecution: z.enum(["MONTH_START", "MID_MONTH"], {
        message: "Le moment de la première exécution est requis",
    }),
    amount: z
        .number({ message: "Le montant est requis" })
        .positive("Le montant doit être positif")
        .min(1, "Le montant minimum est de 1 €"),
})

export type InvestmentPlanFormSchema = z.infer<typeof investmentPlanFormSchema>
