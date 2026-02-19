import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Mentions légales",
    description: "Mentions légales de Tradelab Studio : éditeur, hébergement, propriété intellectuelle et responsabilités.",
}

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Button variant="outline" asChild className="mb-4">
                        <Link href="/">← Retour à l'accueil</Link>
                    </Button>
                    <h1 className="text-3xl font-bold mb-4">Mentions Légales</h1>
                    <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
                </div>

                <Separator className="my-8" />

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Identification de l'éditeur</h2>
                        <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Tradelab Studio</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p>
                                        <strong>Éditeur :</strong> Amaël Rosales
                                    </p>
                                    <p>
                                        <strong>Statut :</strong> Développeur Fullstack
                                    </p>
                                    <p>
                                        <strong>Email :</strong>{" "}
                                        <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline">
                                            contact@tradelab-studio.fr
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Site web :</strong>{" "}
                                        <a href="https://tradelab-studio.fr" className="text-primary hover:underline">
                                            https://tradelab-studio.fr
                                        </a>
                                    </p>
                                    <p>
                                        <strong>Responsable de publication :</strong> Amaël Rosales
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
                        <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Hostinger International Ltd.</h3>
                            <div className="space-y-2">
                                <p>
                                    <strong>Société :</strong> Hostinger International Ltd.
                                </p>
                                <p>
                                    <strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre
                                </p>
                                <p>
                                    <strong>Site web :</strong>{" "}
                                    <a
                                        href="https://www.hostinger.fr"
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        www.hostinger.fr
                                    </a>
                                </p>
                                <p>
                                    <strong>Email :</strong> support@hostinger.com
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Nature du service</h2>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-2">⚠️ Important</h3>
                            <p className="mb-2">
                                <strong>Tradelab Studio est un simulateur de trading à vocation pédagogique.</strong>
                            </p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>Utilisation exclusive d'argent virtuel</li>
                                <li>Aucune transaction financière réelle</li>
                                <li>Données de marché réelles à des fins éducatives</li>
                                <li>Ne constitue pas un conseil en investissement</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
                        <h3 className="text-lg font-medium mb-2">4.1 Droits d'auteur</h3>
                        <p>
                            L'ensemble du site Tradelab Studio, incluant mais non limité à la structure générale, aux logiciels,
                            aux textes, aux images animées ou non, aux sons, aux savoir-faire, aux bases de données, est la
                            propriété exclusive de l'Éditeur.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-4">4.2 Marques</h3>
                        <p>
                            Les dénominations sociales, marques et signes distinctifs reproduits sur le site sont protégés au
                            titre de la propriété intellectuelle.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-4">4.3 Licence du code source</h3>
                        <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4">
                            <p>
                                <strong>Licence MIT</strong>
                            </p>
                            <p className="text-sm mt-2">Copyright (c) 2026 Amaël Rosales</p>
                            <p className="text-sm mt-2">
                                Le code source est disponible sous licence MIT. Voir le fichier LICENSE du projet pour plus de
                                détails.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Données de marché</h2>
                        <h3 className="text-lg font-medium mb-2">5.1 Sources de données</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium">Alpaca API</h4>
                                <p className="text-sm">
                                    Données de marché en temps réel et historiques.
                                    <a
                                        href="https://alpaca.markets"
                                        className="text-primary hover:underline ml-1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        alpaca.markets
                                    </a>
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium">Finnhub API</h4>
                                <p className="text-sm">
                                    Informations sur les entreprises et profils financiers.
                                    <a
                                        href="https://finnhub.io"
                                        className="text-primary hover:underline ml-1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        finnhub.io
                                    </a>
                                </p>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium mb-2 mt-4">5.2 Disclaimer sur les données</h3>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <ul className="list-disc ml-6 space-y-1 text-sm">
                                <li>Les données sont fournies à des fins éducatives uniquement</li>
                                <li>Aucune garantie de précision ou d'exhaustivité</li>
                                <li>Retards possibles dans la transmission des données</li>
                                <li>Ne pas utiliser pour des décisions d'investissement réelles</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Responsabilité</h2>
                        <h3 className="text-lg font-medium mb-2">6.1 Limitation de responsabilité</h3>
                        <p>
                            L'utilisation du site Tradelab Studio se fait sous la responsabilité exclusive de l'utilisateur.
                            L'Éditeur décline toute responsabilité quant aux conséquences directes ou indirectes pouvant résulter
                            de l'accès au site ou de son utilisation.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-4">6.2 Disponibilité du service</h3>
                        <p>
                            L'Éditeur s'efforce d'assurer une disponibilité optimale du service, mais ne peut garantir une
                            accessibilité permanente. Le service peut être interrompu pour maintenance, mise à jour, ou en cas de
                            force majeure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Protection des données personnelles</h2>
                        <p>
                            Le traitement des données personnelles est effectué en conformité avec le Règlement Général sur la
                            Protection des Données (RGPD) et la loi française.
                        </p>
                        <p>
                            Pour plus d'informations, consultez notre
                            <a href="/privacy" className="text-primary hover:underline">
                                {" "}
                                Politique de Confidentialité
                            </a>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
                        <p>
                            <strong>Ce site n'utilise aucun cookie.</strong>
                        </p>
                        <p className="mt-2">
                            L'authentification et les préférences utilisateur sont gérées via des tokens JWT stockés localement
                            dans le navigateur, sans recours à des cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Droit applicable</h2>
                        <p>
                            Les présentes mentions légales sont soumises au droit français. Tout litige relatif à l'utilisation du
                            site sera de la compétence exclusive des tribunaux français.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Médiation et règlement des litiges</h2>
                        <p>
                            Conformément à l'article L. 616-1 du Code de la consommation, nous vous informons qu'en cas de litige,
                            vous pouvez recourir gratuitement à un service de médiation de la consommation.
                        </p>
                        <p className="mt-2">
                            <strong>Plateforme de résolution des litiges :</strong>
                            <a
                                href="https://ec.europa.eu/consumers/odr/"
                                className="text-primary hover:underline ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ec.europa.eu/consumers/odr/
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                        <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4">
                            <p>Pour toute question concernant ces mentions légales :</p>
                            <p className="mt-2">
                                <strong>Email :</strong>
                                <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline ml-1">
                                    contact@tradelab-studio.fr
                                </a>
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">12. Crédits</h2>
                        <h3 className="text-lg font-medium mb-2">Technologies utilisées</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-1">Frontend</h4>
                                <ul className="list-disc ml-4 space-y-1">
                                    <li>Next.js (React)</li>
                                    <li>TypeScript</li>
                                    <li>Tailwind CSS</li>
                                    <li>Shadcn/ui</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">Backend</h4>
                                <ul className="list-disc ml-4 space-y-1">
                                    <li>NestJS</li>
                                    <li>Prisma ORM</li>
                                    <li>PostgreSQL</li>
                                    <li>Node.js</li>
                                </ul>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium mb-2 mt-4">Ressources externes</h3>
                        <ul className="list-disc ml-6 space-y-1 text-sm">
                            <li>Icons par Tabler Icons et Lucide</li>
                            <li>Fonts par Google Fonts (Geist)</li>
                        </ul>
                    </section>
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
