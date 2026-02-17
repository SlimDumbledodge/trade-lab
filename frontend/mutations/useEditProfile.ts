import { useMutation } from "@tanstack/react-query"
import { updateProfile } from "@/lib/api"
import { EditProfileFormSchema } from "@/lib/validations/edit-profile-form.schema"

export const useEditProfile = () => {
    return useMutation({
        mutationFn: ({ data, token }: { data: EditProfileFormSchema; token?: string }) => updateProfile(data, token),
    })
}
