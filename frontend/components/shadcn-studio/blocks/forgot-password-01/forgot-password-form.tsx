"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordFormSchema, ForgotPasswordFormSchema } from "@/lib/validations/forgot-password-form.schema"
import { useForgotPassword } from "@/mutations/useForgotPassword"
import toast from "react-hot-toast"

const ForgotPasswordForm = () => {
    const form = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    })

    const forgotPasswordMutation = useForgotPassword()

    const onSubmit = async (values: ForgotPasswordFormSchema) => {
        try {
            await forgotPasswordMutation.mutateAsync({ email: values.email })
            form.reset()
            toast.success("Email envoyé ! Vérifiez votre boîte mail.")
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue")
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="leading-5">Adresse email*</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Entrez votre adresse email"
                                    disabled={forgotPasswordMutation.isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" type="submit" disabled={forgotPasswordMutation.isPending}>
                    {forgotPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Envoyer le lien de réinitialisation
                </Button>
            </form>
        </Form>
    )
}

export default ForgotPasswordForm
