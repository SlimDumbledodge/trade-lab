"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

import { EyeIcon, EyeOffIcon, Loader2, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { resetPasswordFormSchema, ResetPasswordFormSchema } from "@/lib/validations/reset-password-form.schema"
import { useResetPassword } from "@/mutations/useResetPassword"
import ErrorPage from "@/app/not-found"

const ResetPasswordForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

    const form = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    const resetPasswordMutation = useResetPassword()

    const onSubmit = async (values: ResetPasswordFormSchema) => {
        if (!token) {
            toast.error("Token manquant. Veuillez utiliser le lien reçu par email.")
            return
        }

        try {
            await resetPasswordMutation.mutateAsync({ token, newPassword: values.newPassword })
            form.reset()
            toast.success("Mot de passe réinitialisé avec succès !")
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue")
        }
    }

    if (!token) return <ErrorPage />

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Password */}
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="leading-5">Nouveau mot de passe*</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={isPasswordVisible ? "text" : "password"}
                                        placeholder="••••••••••••••••"
                                        className="pr-9"
                                        disabled={resetPasswordMutation.isPending}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsPasswordVisible((prevState) => !prevState)}
                                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                        disabled={resetPasswordMutation.isPending}
                                    >
                                        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                        <span className="sr-only">
                                            {isPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        </span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Confirm Password */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="leading-5">Confirmer le mot de passe*</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                        placeholder="••••••••••••••••"
                                        className="pr-9"
                                        disabled={resetPasswordMutation.isPending}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsConfirmPasswordVisible((prevState) => !prevState)}
                                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                        disabled={resetPasswordMutation.isPending}
                                    >
                                        {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                        <span className="sr-only">
                                            {isConfirmPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        </span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" type="submit" disabled={resetPasswordMutation.isPending}>
                    {resetPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Définir le nouveau mot de passe
                </Button>
            </form>
        </Form>
    )
}

export default ResetPasswordForm
