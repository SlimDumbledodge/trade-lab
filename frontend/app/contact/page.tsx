import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import ContactFormClient from "@/components/forms/ContactFormClient"
import { JsonLd } from "@/components/seo/JsonLd"

const contactPageJsonLd = {
    "@context": "https://schema.org" as const,
    "@type": "ContactPage" as const,
    name: "Contactez Tradelab Studio",
    description: "Contactez l'équipe Tradelab Studio pour toute question, suggestion ou signalement de bug.",
    url: "https://tradelab-studio.fr/contact",
    mainEntity: {
        "@type": "Organization" as const,
        name: "Tradelab Studio",
        email: "contact@tradelab-studio.fr",
        url: "https://tradelab-studio.fr",
    },
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd data={contactPageJsonLd as any} />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button variant="outline" asChild className="mb-4">
                        <Link href="/">← Retour à l'accueil</Link>
                    </Button>
                    <h1 className="text-3xl font-bold mb-4">Nous Contacter</h1>
                    <p className="text-muted-foreground">
                        Vous avez une question, un problème ou une suggestion ? N'hésitez pas à nous contacter !
                    </p>
                </div>

                <ContactFormClient />

                {/* Temps de réponse */}
                <div className="mt-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <h3 className="font-medium">Temps de réponse</h3>
                                <p className="text-sm text-muted-foreground">
                                    Nous nous efforçons de répondre à tous les messages dans les <strong>24-48 heures</strong>
                                    en période normale. Les demandes complexes peuvent prendre un peu plus de temps.
                                </p>
                                <p className="text-xs text-muted-foreground">Merci de votre patience ! 🙏</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8" />

                <div className="text-center">
                    <Button asChild>
                        <Link href="/">Retour à l'accueil</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
