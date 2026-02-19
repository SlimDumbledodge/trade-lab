import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Politique de confidentialité",
    description: "Découvrez comment Tradelab Studio collecte, utilise et protège vos données personnelles conformément au RGPD.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Button variant="outline" asChild className="mb-4">
                        <Link href="/">← Retour à l'accueil</Link>
                    </Button>
                    <h1 className="text-3xl font-bold mb-4">Politique de Confidentialité</h1>
                    <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
                </div>

                <Separator className="my-8" />

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Responsable du traitement</h2>
                        <p>
                            Tradelab Studio, développé par Amaël Rosales ("nous", "notre", "nos"), s'engage à protéger et
                            respecter votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons
                            vos données personnelles.
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p>
                                <strong>Contact :</strong>{" "}
                                <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline">
                                    contact@tradelab-studio.fr
                                </a>
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
                        <h3 className="text-lg font-medium mb-2">2.1 Données d'inscription</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Nom d'utilisateur :</strong> Pour l'identification sur la plateforme
                            </li>
                            <li>
                                <strong>Adresse email :</strong> Pour la connexion et les communications
                            </li>
                            <li>
                                <strong>Mot de passe hashé :</strong> Pour l'authentification sécurisée
                            </li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-4">2.2 Données d'utilisation</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Transactions simulées :</strong> Historique de vos opérations virtuelles
                            </li>
                            <li>
                                <strong>Portfolio virtuel :</strong> Composition et performance de votre portefeuille
                            </li>
                            <li>
                                <strong>Préférences utilisateur :</strong> Paramètres et configuration
                            </li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-4">2.3 Données techniques</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Logs de connexion :</strong> Adresse IP, horodatage
                            </li>
                            <li>
                                <strong>Données de navigation :</strong> Pages visitées, temps de session
                            </li>
                            <li>
                                <strong>Informations techniques :</strong> Navigateur, système d'exploitation
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Finalités du traitement</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">
                                    3.1 Fourniture du service (base légale : exécution du contrat)
                                </h3>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Création et gestion de votre compte</li>
                                    <li>Simulation de trading et gestion du portfolio virtuel</li>
                                    <li>Authentification et sécurité</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">3.2 Communication (base légale : intérêt légitime)</h3>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Envoi d'emails de réinitialisation de mot de passe</li>
                                    <li>Notifications importantes sur le service</li>
                                    <li>Support technique</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">
                                    3.3 Amélioration du service (base légale : intérêt légitime)
                                </h3>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Analyse d'utilisation anonymisée</li>
                                    <li>Détection et prévention des dysfonctionnements</li>
                                    <li>Optimisation des performances</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Base légale des traitements</h2>
                        <p>Conformément au RGPD, nos traitements reposent sur :</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Exécution du contrat :</strong> Fourniture du service Tradelab Studio
                            </li>
                            <li>
                                <strong>Intérêt légitime :</strong> Amélioration du service, sécurité, communications
                            </li>
                            <li>
                                <strong>Consentement :</strong> Cookies non-essentiels (si applicable)
                            </li>
                            <li>
                                <strong>Obligation légale :</strong> Conservation des logs (si applicable)
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Partage des données</h2>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-2">✅ Engagement de confidentialité</h3>
                            <p>
                                <strong>
                                    Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers à des
                                    fins commerciales.
                                </strong>
                            </p>
                        </div>

                        <h3 className="text-lg font-medium mb-2 mt-4">Exceptions strictement limitées :</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Prestataires techniques :</strong> Hébergement sécurisé (avec DPA)
                            </li>
                            <li>
                                <strong>Obligation légale :</strong> Sur demande des autorités compétentes
                            </li>
                            <li>
                                <strong>Sécurité :</strong> Protection contre fraude ou menaces
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Données de marché et APIs externes</h2>
                        <p>Tradelab Studio utilise des données financières en temps réel provenant de :</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Alpaca API :</strong> Données de marché et prix des actifs
                            </li>
                            <li>
                                <strong>Finnhub API :</strong> Informations sur les entreprises
                            </li>
                        </ul>
                        <p className="mt-2">
                            Ces données sont utilisées uniquement pour la simulation. Aucune donnée personnelle n'est transmise à
                            ces services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Durée de conservation</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                                            Type de données
                                        </th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                                            Durée de conservation
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                            Données de compte
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                            Jusqu'à suppression du compte + 1 mois
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                            Historique des transactions
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                            Durée de vie du compte
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Logs techniques</td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">12 mois maximum</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                            Données anonymisées
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                            Pas de limite (anonymes)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Vos droits RGPD</h2>
                        <p>Conformément au RGPD, vous disposez des droits suivants :</p>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">🔍 Droit d'accès</h3>
                                <p className="text-sm">Obtenir une copie de vos données personnelles</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">✏️ Droit de rectification</h3>
                                <p className="text-sm">Corriger des données inexactes</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">🗑️ Droit à l'effacement</h3>
                                <p className="text-sm">Supprimer vos données personnelles</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">⏸️ Droit à la limitation</h3>
                                <p className="text-sm">Restreindre le traitement</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">📦 Droit à la portabilité</h3>
                                <p className="text-sm">Récupérer vos données dans un format standard</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">⛔ Droit d'opposition</h3>
                                <p className="text-sm">S'opposer à certains traitements</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                            <p>
                                <strong>Pour exercer vos droits :</strong>{" "}
                                <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline">
                                    contact@tradelab-studio.fr
                                </a>
                            </p>
                            <p className="text-sm mt-1">Délai de réponse : 1 mois maximum</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Sécurité des données</h2>
                        <h3 className="text-lg font-medium mb-2">Mesures de protection</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Chiffrement :</strong> HTTPS pour toutes les communications
                            </li>
                            <li>
                                <strong>Hachage :</strong> Mots de passe sécurisés avec bcrypt
                            </li>
                            <li>
                                <strong>Authentification :</strong> JWT avec expiration
                            </li>
                            <li>
                                <strong>Rate limiting :</strong> Protection contre les attaques
                            </li>
                            <li>
                                <strong>Monitoring :</strong> Surveillance avec Sentry
                            </li>
                            <li>
                                <strong>Accès restreint :</strong> Principe du moindre privilège
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Cookies et traceurs</h2>
                        <p>
                            <strong>Ce site n'utilise aucun cookie.</strong>
                        </p>
                        <p className="mt-2">
                            L'authentification se fait via des tokens JWT stockés dans le localStorage de votre navigateur. Les
                            préférences utilisateur (comme le thème sombre/clair) sont également stockées localement via
                            localStorage, sans utilisation de cookies.
                        </p>
                        <p className="mt-2">Nous n'utilisons pas non plus de cookies analytiques ou de suivi tiers.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Transferts internationaux</h2>
                        <p>
                            Vos données sont hébergées en France/UE. En cas de transfert vers des pays tiers, nous nous assurons
                            que des garanties appropriées sont mises en place (clauses contractuelles types, décision
                            d'adéquation).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">12. Modifications de cette politique</h2>
                        <p>
                            Nous pouvons mettre à jour cette politique de confidentialité. Les changements importants vous seront
                            notifiés par email ou via la plateforme.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">13. Contact et réclamations</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Contact</h3>
                                <p>
                                    Email :{" "}
                                    <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline">
                                        contact@tradelab-studio.fr
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">Réclamation CNIL</h3>
                                <p>
                                    Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
                                    auprès de la CNIL :
                                    <a
                                        href="https://www.cnil.fr/fr/plaintes"
                                        className="text-primary hover:underline ml-1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        www.cnil.fr/fr/plaintes
                                    </a>
                                </p>
                            </div>
                        </div>
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
