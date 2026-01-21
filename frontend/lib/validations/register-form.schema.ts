import { z } from "zod"

export const registerFormSchema = z
    .object({
        username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
        email: z.string().min(1, { message: "L'email est requis" }).email({ message: "Email invalide" }),
        password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
        confirmPassword: z.string().min(1, { message: "Veuillez confirmer votre mot de passe" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
