import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "@/lib/api"

export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) => resetPassword(token, newPassword),
    })
}
