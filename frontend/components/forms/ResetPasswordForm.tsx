"use client"

import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AuthBackgroundShape from "@/assets/svg/auth-background-shape"
import ResetPasswordForm from "@/components/shadcn-studio/blocks/reset-password-01/reset-password-form"
import { useSearchParams } from "next/navigation"
import ErrorPage from "@/app/not-found"

const ResetPassword = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    if (!token) return <ErrorPage />
    return (
        <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute">
                <AuthBackgroundShape />
            </div>

            <Card className="z-1 w-full border-none shadow-md sm:max-w-md">
                <CardHeader className="gap-6">
                    <div className="flex items-center gap-3">
                        <Image src="/icon.png" alt="Logo Tradelab" width={35} height={35} />
                        <span className="text-xl font-semibold">tradelab/studio</span>
                    </div>

                    <div>
                        <CardTitle className="mb-1.5 text-2xl">Réinitialiser le mot de passe</CardTitle>
                        <CardDescription className="text-base">
                            Choisissez un nouveau mot de passe pour sécuriser votre compte.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* ResetPassword Form */}
                    <ResetPasswordForm />

                    <Link href="/login" className="group mx-auto flex w-fit items-center gap-2">
                        <ChevronLeftIcon className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        <span>Retour à la connexion</span>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword
