import { z } from "zod"

export const loginFormSchema = z.object({
    email: z.string().min(1, { message: "L'email est requis" }).email({ message: "Email invalide" }),
    password: z.string().min(1, { message: "Le mot de passe est requis" }),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>
