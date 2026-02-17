"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { User, Mail, Wallet, CalendarDays, Camera } from "lucide-react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { Card, CardContent } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/usePortfolio"
import { PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ButtonLoader } from "@/components/ui/ButtonLoader"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useUploadAvatar } from "@/mutations/useUploadAvatar"
import { useEditProfile } from "@/mutations/useEditProfile"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { avatarFormSchema, AvatarFormSchema } from "@/lib/validations/avatar-form.schema"
import { editProfileFormSchema, EditProfileFormSchema } from "@/lib/validations/edit-profile-form.schema"
import toast from "react-hot-toast"

function getInitials(name?: string | null) {
    if (!name) return "?"
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

function formatDate(dateStr?: string) {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

export default function AccountPage() {
    useEffect(() => {
        document.title = "Tradelab Studio | Mon compte"
    }, [])

    const { data: session, update: updateSession } = useSession()
    const { data: portfolio, isLoading } = usePortfolio(PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY, session?.accessToken)
    const uploadAvatarMutation = useUploadAvatar()
    const editProfileMutation = useEditProfile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const avatarUrl = session?.user?.avatarPath
        ? `${process.env.NEXT_PUBLIC_NEST_API_URL}/${session.user.avatarPath.replace(/^\/?uploads/, "uploads")}`
        : null

    const form = useForm<AvatarFormSchema>({
        resolver: zodResolver(avatarFormSchema),
    })

    const editProfileForm = useForm<EditProfileFormSchema>({
        resolver: zodResolver(editProfileFormSchema),
        mode: "onChange",
        defaultValues: {
            username: session?.user?.name || "",
            email: session?.user?.email || "",
        },
    })

    // Resync form defaults when session loads
    useEffect(() => {
        if (session?.user) {
            editProfileForm.reset({
                username: session.user.name || "",
                email: session.user.email || "",
            })
        }
    }, [session?.user, editProfileForm])

    const onSubmit = (values: AvatarFormSchema) => {
        uploadAvatarMutation.mutate(
            { file: values.avatar, token: session?.accessToken },
            {
                onSuccess: async (data) => {
                    await updateSession({
                        ...session,
                        user: { ...session?.user, avatarPath: data.avatarPath },
                    })
                    toast.success("Avatar mis à jour avec succès")
                },
                onError: () => {
                    toast.error("Erreur lors de la mise à jour de l'avatar")
                },
            },
        )
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        form.setValue("avatar", file)
        form.handleSubmit(onSubmit)()

        // Reset l'input pour pouvoir re-sélectionner le même fichier
        e.target.value = ""
    }

    return (
        <HomeLayout headerTitle="Mon compte">
            <div className="w-full max-w-3xl space-y-6">
                {/* ── Hero Profile Card ── */}
                <Card className="relative overflow-hidden border-0 shadow-xl">
                    {/* Gradient banner */}
                    <div className="h-36 w-full bg-gradient-to-br from-purple-700 via-violet-500 to-fuchsia-400 sm:h-40" />

                    <CardContent className="relative px-6 pb-6 pt-0">
                        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-6">
                            <div className="relative z-10 -mt-16 shrink-0">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    className="group relative rounded-full ring-4 ring-card focus:outline-none focus-visible:ring-primary"
                                    aria-label="Modifier l'avatar"
                                >
                                    <Avatar className="size-28 text-3xl shadow-lg">
                                        {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" className="object-cover" />}
                                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-400 text-3xl font-bold text-white">
                                            {getInitials(session?.user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Overlay hover */}
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all duration-200 group-hover:bg-black/50">
                                        <Camera className="size-7 text-white opacity-0 transition-all duration-200 group-hover:opacity-100" />
                                    </div>
                                </button>
                            </div>

                            {/* Identité */}
                            <div className="flex flex-1 flex-col items-center gap-1.5 pb-1 sm:items-start">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold tracking-tight">{session?.user?.name || "Utilisateur"}</h2>
                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                                        Membre
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="group transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                                <Wallet className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Solde disponible</p>
                                {isLoading ? (
                                    <Skeleton className="mt-1 h-5 w-20" />
                                ) : (
                                    <p className="text-lg font-bold tabular-nums">
                                        {portfolio?.cashBalance
                                            ? `${Number(portfolio.cashBalance).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`
                                            : "0,00 €"}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                                <CalendarDays className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Membre depuis</p>
                                <p className="text-md font-bold">{formatDate(session?.user?.createdAt)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                                <User className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Statut du compte</p>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-emerald-500" />
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Actif</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Personal Info Card ── */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-base font-semibold">Informations personnelles</h3>
                        <p className="text-sm text-muted-foreground">
                            Modifiez votre nom d&apos;utilisateur ou votre adresse email.
                        </p>

                        <Separator className="my-5" />

                        <Form {...editProfileForm}>
                            <form
                                onSubmit={editProfileForm.handleSubmit((values) => {
                                    editProfileMutation.mutate(
                                        { data: values, token: session?.accessToken },
                                        {
                                            onSuccess: async (data) => {
                                                await updateSession({
                                                    ...session,
                                                    user: {
                                                        ...session?.user,
                                                        name: data.username,
                                                        email: data.email,
                                                    },
                                                })
                                                editProfileForm.reset({
                                                    username: data.username,
                                                    email: data.email,
                                                })
                                                toast.success("Profil mis à jour avec succès")
                                            },
                                            onError: () => {
                                                toast.error("Erreur lors de la mise à jour du profil")
                                            },
                                        },
                                    )
                                })}
                                className="space-y-5"
                            >
                                <FormField
                                    control={editProfileForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-1 items-start gap-1 sm:grid-cols-[180px_1fr]">
                                            <FormLabel className="flex items-center gap-2 pt-2.5 text-muted-foreground">
                                                <User className="size-4" />
                                                Nom d&apos;utilisateur
                                            </FormLabel>
                                            <div className="space-y-1">
                                                <FormControl>
                                                    <Input placeholder="Votre nom d'utilisateur" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={editProfileForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-1 items-start gap-1 sm:grid-cols-[180px_1fr]">
                                            <FormLabel className="flex items-center gap-2 pt-2.5 text-muted-foreground">
                                                <Mail className="size-4" />
                                                Adresse email
                                            </FormLabel>
                                            <div className="space-y-1">
                                                <FormControl>
                                                    <Input type="email" placeholder="Votre adresse email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end pt-2">
                                    <ButtonLoader
                                        variant="default"
                                        type="submit"
                                        className="h-8 px-3 text-sm"
                                        disabled={!editProfileForm.formState.isDirty || !editProfileForm.formState.isValid}
                                        isLoading={editProfileMutation.isPending}
                                    >
                                        Enregistrer
                                    </ButtonLoader>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </HomeLayout>
    )
}
