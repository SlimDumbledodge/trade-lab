import { z } from "zod"

export const contactFormSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").max(50, "Le prénom est trop long"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom est trop long"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    subject: z
        .string()
        .min(5, "Le sujet doit contenir au moins 5 caractères")
        .max(100, "Le sujet est trop long (max 100 caractères)"),
    message: z
        .string()
        .min(20, "Le message doit contenir au moins 20 caractères")
        .max(1000, "Le message est trop long (max 1000 caractères)"),
})

export type ContactFormSchema = z.infer<typeof contactFormSchema>
