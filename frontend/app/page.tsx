"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-[40%] left-1/2 h-[80%] w-[200%] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600/20 via-primary/20 to-fuchsia-600/20 blur-3xl" />
            </div>

            {/* Navbar */}
            <header className="relative z-50">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3">
                        <Image src="/icon.png" alt="Tradelab" width={28} height={28} className="sm:h-9 sm:w-9" />
                        <span className="hidden font-medium text-foreground sm:block sm:text-lg">tradelab/studio</span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-sm">
                                Se connecter
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm" className="text-sm ">
                                Créer un compte
                            </Button>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <main className="relative">
                <section className="mx-auto max-w-7xl px-6 pb-32 pt-20 lg:pt-32">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Badge */}
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                            </span>
                            <span className="text-muted-foreground">Marchés ouverts</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                            Investissez sans
                            <span className="relative mx-3 inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-violet-500 via-primary to-fuchsia-500 bg-clip-text text-transparent">
                                    risque
                                </span>
                            </span>
                        </h1>

                        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                            Simulez vos investissements avec des données réelles. Apprenez, testez vos stratégies, et développez
                            vos compétences avant de passer au réel.
                        </p>

                        {/* CTA */}
                        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/register">
                                <Button size="lg" className="gap-2 px-8 text-base">
                                    <Play className="h-4 w-4" />
                                    Commencer maintenant
                                </Button>
                            </Link>
                            <Link href="/market">
                                <Button size="lg" variant="outline" className="gap-2 px-8 text-base">
                                    Explorer les marchés
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center text-sm text-muted-foreground">
                            <div>
                                <div className="text-3xl font-bold text-foreground">10k€</div>
                                <div className="mt-1">Capital de départ</div>
                            </div>
                            <div className="hidden h-8 w-px bg-border sm:block" />
                            <div>
                                <div className="text-3xl font-bold text-foreground">Temps réel</div>
                                <div className="mt-1">Données via Alpaca</div>
                            </div>
                            <div className="hidden h-8 w-px bg-border sm:block" />
                            <div>
                                <div className="text-3xl font-bold text-foreground">0 risque</div>
                                <div className="mt-1">Argent 100% virtuel</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="relative border-t border-border/50 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-6 py-24">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="group rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all ">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">Trading simulé</h3>
                                <p className="text-sm text-muted-foreground">
                                    Achetez et vendez des actions comme sur un vrai compte, sans les conséquences financières.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">Suivi performant</h3>
                                <p className="text-sm text-muted-foreground">
                                    Visualisez l'évolution de votre portefeuille avec des graphiques clairs et détaillés.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">100% sécurisé</h3>
                                <p className="text-sm text-muted-foreground">
                                    Aucun risque financier. Apprenez sereinement dans un environnement protégé.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden border-t border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                    <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Prêt à apprendre ?</h2>
                        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
                            Créez votre compte en quelques secondes et commencez à trader avec 10 000€ virtuels.
                        </p>
                        <div className="mt-8">
                            <Link href="/register">
                                <Button size="lg" className="gap-2 px-8 text-base">
                                    Créer mon compte gratuit
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/50">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Image src="/icon.png" alt="Tradelab" width={20} height={20} />
                        <span>tradelab/studio</span>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="/legal" className="transition-colors hover:text-foreground">
                            Mentions légales
                        </Link>
                        <Link href="/privacy" className="transition-colors hover:text-foreground">
                            Confidentialité
                        </Link>
                        <Link href="/contact" className="transition-colors hover:text-foreground">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
