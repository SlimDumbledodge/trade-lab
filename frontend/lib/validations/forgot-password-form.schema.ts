import { z } from "zod"

export const forgotPasswordFormSchema = z.object({
    email: z.string().min(1, { message: "L'email est requis" }).email({ message: "Email invalide" }),
})

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>
