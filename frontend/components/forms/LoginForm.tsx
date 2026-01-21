"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonLoader } from "@/components/ui/ButtonLoader"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormSchema, LoginFormSchema } from "@/lib/validations/login-form.schema"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import AuthBackgroundShape from "@/assets/svg/auth-background-shape"

const LoginForm = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: LoginFormSchema) => {
        setIsLoading(true)
        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                callbackUrl: "/portfolio",
                redirect: false,
            })

            if (result?.error) {
                // Analyser le type d'erreur pour afficher un message approprié
                console.log("Error from signIn:", result.error)
                if (result.error === "429") {
                    toast.error("Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.")
                } else if (result.error === "500" || result.error === "503") {
                    toast.error("Le serveur est temporairement indisponible. Veuillez réessayer plus tard.")
                } else if (result.error === "401" || result.error === "404" || result.error === "CredentialsSignin") {
                    toast.error("Email ou mot de passe incorrect")
                } else {
                    toast.error("Une erreur est survenue lors de la connexion")
                }
                setIsLoading(false)
            } else if (result?.ok) {
                // Redirection réussie
                window.location.href = result.url || "/portfolio"
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors de la connexion")
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute">
                <AuthBackgroundShape />
            </div>

            <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
                <CardHeader className="gap-6">
                    <div className="flex items-center gap-3">
                        <Image src="/icon.png" alt="Logo TradeLab" width={35} height={35} />
                        <span className="text-xl font-semibold">tradelab/studio</span>
                    </div>

                    <div>
                        <CardTitle className="mb-1.5 text-2xl">Connexion à TradeLab Studio</CardTitle>
                        <CardDescription className="text-base">
                            Investissez en toute sécurité grâce à l'argent virtuelle.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
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
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="leading-5">Mot de passe*</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={isVisible ? "text" : "password"}
                                                        placeholder="••••••••••••••••"
                                                        className="pr-9"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setIsVisible((prevState) => !prevState)}
                                                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                                        disabled={isLoading}
                                                    >
                                                        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                                                        <span className="sr-only">
                                                            {isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Forgot Password */}
                                <div className="flex items-center justify-end">
                                    <Link href="/forgot-password" className="hover:underline">
                                        Mot de passe oublié ?
                                    </Link>
                                </div>

                                {isLoading ? (
                                    <ButtonLoader type="submit" variant="default" className="w-full">
                                        Connexion en cours
                                    </ButtonLoader>
                                ) : (
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        disabled={!form.formState.isValid && form.formState.isSubmitted}
                                    >
                                        Se connecter
                                    </Button>
                                )}
                            </form>
                        </Form>

                        <p className="text-muted-foreground text-center">
                            Nouveau sur notre plateforme ?{" "}
                            <Link href="/register" className="text-card-foreground hover:underline">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginForm
