import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import ForgotPasswordForm from "@/components/shadcn-studio/blocks/forgot-password-01/forgot-password-form"
import AuthBackgroundShape from "@/assets/svg/auth-background-shape"
import Image from "next/image"

const ForgotPassword = () => {
    return (
        <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute">
                <AuthBackgroundShape />
            </div>

            <Card className="z-1 w-full border-none shadow-md sm:max-w-md">
                <CardHeader className="gap-6">
                    <div className="flex items-center gap-3">
                        <Image src="/icon.png" alt="Logo TradeLab" width={35} height={35} />
                        <span className="text-xl font-semibold">tradelab/studio</span>
                    </div>
                    <div>
                        <CardTitle className="mb-1.5 text-2xl">Mot de passe oublié ?</CardTitle>
                        <CardDescription className="text-base">
                            Entrez votre email et nous vous enverrons un lien de réinitialisation
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* ForgotPassword Form */}
                    <ForgotPasswordForm />

                    <Link href="/login" className="group mx-auto flex w-fit items-center gap-2">
                        <ChevronLeftIcon className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        <span>Retour à la connexion</span>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPassword
