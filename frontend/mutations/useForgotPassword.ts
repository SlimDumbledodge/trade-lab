import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "@/lib/api"

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: ({ email }: { email: string }) => forgotPassword(email),
    })
}
