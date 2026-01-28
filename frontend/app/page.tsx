"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    TrendingUpIcon,
    BarChart3Icon,
    ShieldIcon,
    GraduationCapIcon,
    Users,
    Target,
    Award,
    PlayCircle,
    ArrowRight,
    CheckCircle,
} from "lucide-react"

const Page = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge className="rounded-sm border-transparent bg-gradient-to-r from-blue-600 to-purple-600 [background-size:105%] bg-center text-white">
                            Plateforme éducative n°1
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl lg:text-7xl">
                            Apprenez le trading sans
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {" "}
                                risquer
                            </span>{" "}
                            votre argent
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
                            Tradelab Studio vous offre un environnement sécurisé pour maîtriser les marchés financiers avec de
                            l'argent virtuel. Développez vos compétences, testez vos stratégies, progressez à votre rythme.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    Commencer gratuitement
                                </Button>
                            </Link>
                            <Link href="/market">
                                <Button variant="outline" size="lg">
                                    Découvrir les marchés
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                            Tout ce dont vous avez besoin pour apprendre
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Une plateforme complète conçue pour vous accompagner dans votre apprentissage du trading
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
                            <CardHeader>
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                                    <TrendingUpIcon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Données en temps réel</CardTitle>
                                <CardDescription>
                                    Accédez aux données de marché en temps réel via l'API Alpaca pour une expérience authentique
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20">
                            <CardHeader>
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                                    <BarChart3Icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Portefeuille virtuel</CardTitle>
                                <CardDescription>
                                    Gérez votre portefeuille virtuel de 100 000€ et suivez vos performances en détail
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20">
                            <CardHeader>
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                                    <ShieldIcon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">100% sécurisé</CardTitle>
                                <CardDescription>
                                    Aucun risque financier - apprenez avec de l'argent virtuel dans un environnement sûr
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gray-50 dark:bg-gray-900/50 py-20 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
                        <div className="lg:pr-8">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                                Pourquoi choisir Tradelab Studio ?
                            </h2>
                            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                                Notre plateforme vous offre tous les outils nécessaires pour développer vos compétences en trading
                                dans un environnement d'apprentissage optimal.
                            </p>
                            <div className="mt-10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Formation progressive
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Commencez par les bases et progressez à votre rythme avec nos outils adaptés
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Interface intuitive
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Une interface moderne et simple d'utilisation pour vous concentrer sur l'essentiel
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Suivi détaillé</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Analysez vos performances et identifiez les points d'amélioration
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Card className="border-0 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
                                <CardHeader className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                        <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">1000+</CardTitle>
                                    <CardDescription>Utilisateurs actifs</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-0 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
                                <CardHeader className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                        <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        10M€
                                    </CardTitle>
                                    <CardDescription>Volumes échangés</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-0 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
                                <CardHeader className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">95%</CardTitle>
                                    <CardDescription>Taux de satisfaction</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-0 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
                                <CardHeader className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                                        <GraduationCapIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        24/7
                                    </CardTitle>
                                    <CardDescription>Marchés disponibles</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Prêt à commencer votre apprentissage ?
                        </h2>
                        <p className="mt-6 text-lg text-blue-100">
                            Rejoignez des milliers d'utilisateurs qui développent leurs compétences en trading avec Tradelab
                            Studio
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    Créer mon compte gratuit
                                </Button>
                            </Link>
                            <Link href="/FAQ">
                                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white/10">
                                    En savoir plus
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Page
