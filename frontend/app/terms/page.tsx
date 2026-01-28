import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Button variant="outline" asChild className="mb-4">
                        <Link href="/">← Retour à l'accueil</Link>
                    </Button>
                    <h1 className="text-3xl font-bold mb-4">Conditions Générales d'Utilisation</h1>
                    <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
                </div>

                <Separator className="my-8" />

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Objet du service</h2>
                        <p>
                            Tradelab Studio ("le Service") est une plateforme de simulation de trading développée par Amaël
                            Rosales ("l'Éditeur"). Le Service permet aux utilisateurs de simuler des opérations d'achat et de
                            vente d'actifs financiers avec de l'argent virtuel, à des fins éducatives et d'apprentissage.
                        </p>
                        <p>
                            <strong>Important :</strong> Tradelab Studio est un simulateur utilisant de l'argent fictif. Aucune
                            transaction financière réelle n'est effectuée.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Acceptation des conditions</h2>
                        <p>
                            En accédant et en utilisant Tradelab Studio, vous acceptez d'être lié par les présentes Conditions
                            Générales d'Utilisation. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Inscription et compte utilisateur</h2>
                        <h3 className="text-lg font-medium mb-2">3.1 Conditions d'inscription</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Vous devez fournir une adresse email valide et un nom d'utilisateur</li>
                            <li>Vous devez choisir un mot de passe sécurisé</li>
                            <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                            <li>Vous devez fournir des informations exactes</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-4">3.2 Suspension et résiliation</h3>
                        <p>
                            Nous nous réservons le droit de suspendre ou de résilier votre compte à tout moment, notamment en cas
                            de violation des présentes conditions ou d'utilisation abusive du Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Utilisation du service</h2>
                        <h3 className="text-lg font-medium mb-2">4.1 Utilisation autorisée</h3>
                        <p>Le Service est destiné à :</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>L'apprentissage des mécanismes financiers</li>
                            <li>La simulation de stratégies d'investissement</li>
                            <li>L'éducation financière</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-4">4.2 Utilisations interdites</h3>
                        <p>Il est strictement interdit de :</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Utiliser le Service à des fins commerciales sans autorisation</li>
                            <li>Tenter de compromettre la sécurité du système</li>
                            <li>Créer de faux comptes ou usurper l'identité d'autrui</li>
                            <li>Utiliser le Service pour du spam ou des activités illégales</li>
                            <li>Extraire ou copier les données du Service de manière automatisée</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Nature du service et avertissements</h2>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-2">⚠️ Avertissement important</h3>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>
                                    <strong>Simulation uniquement :</strong> Tradelab Studio utilise exclusivement de l'argent
                                    virtuel
                                </li>
                                <li>
                                    <strong>Pas de conseils financiers :</strong> Le Service ne constitue pas un conseil en
                                    investissement
                                </li>
                                <li>
                                    <strong>Données temps réel :</strong> Les prix affichés sont réels mais les transactions sont
                                    fictives
                                </li>
                                <li>
                                    <strong>Risques réels :</strong> Les investissements réels comportent des risques de perte
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Propriété intellectuelle</h2>
                        <p>
                            Le Service, incluant mais sans s'y limiter le code source, le design, les textes, les images, et la
                            marque Tradelab Studio, est la propriété exclusive de l'Éditeur et est protégé par les lois sur la
                            propriété intellectuelle.
                        </p>
                        <p>
                            Aucune licence ou droit d'utilisation n'est accordé aux utilisateurs, hormis le droit d'utiliser le
                            Service conformément aux présentes conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Limitation de responsabilité</h2>
                        <p>L'Éditeur ne saurait être tenu responsable de :</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Toute perte financière résultant de l'utilisation du Service</li>
                            <li>L'interruption temporaire ou définitive du Service</li>
                            <li>La précision des données de marché affichées</li>
                            <li>Les décisions d'investissement prises par l'utilisateur</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Protection des données</h2>
                        <p>
                            Le traitement de vos données personnelles est régi par notre
                            <a href="/privacy" className="text-primary hover:underline">
                                {" "}
                                Politique de Confidentialité
                            </a>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Modifications des conditions</h2>
                        <p>
                            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent
                            effet dès leur publication sur le Site. Il vous incombe de consulter régulièrement ces conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Droit applicable et juridiction</h2>
                        <p>
                            Les présentes conditions sont régies par le droit français. Tout litige relatif à l'utilisation du
                            Service sera soumis à la compétence exclusive des tribunaux français.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                        <p>
                            Pour toute question concernant ces conditions, vous pouvez nous contacter à l'adresse :{" "}
                            <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline">
                                contact@tradelab-studio.fr
                            </a>
                        </p>
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
