import { z } from "zod"

export const resetPasswordFormSchema = z
    .object({
        newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

export type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>
