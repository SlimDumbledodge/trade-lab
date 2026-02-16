import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export const avatarFormSchema = z.object({
    avatar: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Le fichier ne doit pas dépasser 5 Mo")
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Format accepté : JPEG, PNG, GIF, WebP"),
})

export type AvatarFormSchema = z.infer<typeof avatarFormSchema>
