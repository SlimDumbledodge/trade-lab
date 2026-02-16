import { useMutation } from "@tanstack/react-query"
import { uploadAvatar } from "@/lib/api"

export const useUploadAvatar = () => {
    return useMutation({
        mutationFn: ({ file, token }: { file: File; token?: string }) => uploadAvatar(file, token),
    })
}
