"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonLoader } from "@/components/ui/ButtonLoader"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerFormSchema, RegisterFormSchema } from "@/lib/validations/register-form.schema"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import AuthBackgroundShape from "@/assets/svg/auth-background-shape"

const RegisterForm = () => {
    const router = useRouter()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: RegisterFormSchema) => {
        setIsLoading(true)
        try {
            // Créer le compte
            const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                toast.error(errorData.message || "Une erreur est survenue lors de l'inscription")
                setIsLoading(false)
                return
            }

            // Connexion automatique après inscription
            const loginRes = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (loginRes?.error) {
                toast.error("Compte créé mais erreur de connexion. Veuillez vous connecter manuellement.")
                router.push("/login")
            } else if (loginRes?.ok) {
                toast.success("Compte créé avec succès !")
                router.push("/portfolio")
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'inscription")
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
                        <span className="text-xl font-semibold">TradeLab</span>
                    </div>

                    <div>
                        <CardTitle className="mb-1.5 text-2xl">Inscription à TradeLab</CardTitle>
                        <CardDescription className="text-base">Gérez votre portefeuille en toute simplicité.</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <Form {...form}>
                            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="leading-5">Nom d'utilisateur*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Entrez votre nom d'utilisateur"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        placeholder="••••••••••••••••"
                                                        className="pr-9"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setIsPasswordVisible((prevState) => !prevState)}
                                                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                                        disabled={isLoading}
                                                    >
                                                        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                                        <span className="sr-only">
                                                            {isPasswordVisible
                                                                ? "Masquer le mot de passe"
                                                                : "Afficher le mot de passe"}
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
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setIsConfirmPasswordVisible((prevState) => !prevState)}
                                                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                                        disabled={isLoading}
                                                    >
                                                        {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                                        <span className="sr-only">
                                                            {isConfirmPasswordVisible
                                                                ? "Masquer le mot de passe"
                                                                : "Afficher le mot de passe"}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Privacy policy */}
                                <div className="flex items-center gap-3">
                                    <Checkbox id="terms" className="size-6" required />
                                    <Label htmlFor="terms">
                                        <span className="text-muted-foreground">J'accepte les</span>{" "}
                                        <a href="#">conditions générales</a>
                                    </Label>
                                </div>

                                {isLoading ? (
                                    <ButtonLoader type="submit" variant="default" className="w-full">
                                        Inscription en cours
                                    </ButtonLoader>
                                ) : (
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        disabled={!form.formState.isValid && form.formState.isSubmitted}
                                    >
                                        S'inscrire
                                    </Button>
                                )}
                            </form>
                        </Form>

                        <p className="text-muted-foreground text-center">
                            Vous avez déjà un compte ?{" "}
                            <Link href="/login" className="text-card-foreground hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterForm
