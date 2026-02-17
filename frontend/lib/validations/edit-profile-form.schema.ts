import { z } from "zod"

export const editProfileFormSchema = z.object({
    username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
    email: z.string().min(1, { message: "L'email est requis" }).email({ message: "Email invalide" }),
})

export type EditProfileFormSchema = z.infer<typeof editProfileFormSchema>
