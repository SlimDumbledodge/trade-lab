import { useMutation } from "@tanstack/react-query"
import { sendContactMessage } from "@/lib/api"
import { ContactFormSchema } from "@/lib/validations/contact-form.schema"

export const useContactForm = () => {
    return useMutation({
        mutationFn: (data: ContactFormSchema) => sendContactMessage(data),
    })
}
