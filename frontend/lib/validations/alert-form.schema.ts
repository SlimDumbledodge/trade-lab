import { z } from "zod"

export const alertFormSchema = z.object({
    symbol: z.string().min(1, "Veuillez sélectionner un actif"),
    direction: z.enum(["ABOVE", "BELOW"], { message: "Veuillez choisir une condition" }),
    targetPrice: z.number({ message: "Le prix cible est requis" }).positive("Le prix cible doit être positif"),
})

export type AlertFormSchema = z.infer<typeof alertFormSchema>
