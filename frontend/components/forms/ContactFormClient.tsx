"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactFormSchema, ContactFormSchema } from "@/lib/validations/contact-form.schema"
import { useContactForm } from "@/mutations/useContactForm"
import { Button } from "@/components/ui/button"
import { ButtonLoader } from "@/components/ui/ButtonLoader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, MessageSquare, FileText, Shield, Bug, CheckCircle } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function ContactPageClient() {
    const [isSuccess, setIsSuccess] = useState(false)
    const { mutate: sendMessage, isPending } = useContactForm()

    const form = useForm<ContactFormSchema>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
        },
    })

    const onSubmit = (values: ContactFormSchema) => {
        sendMessage(values, {
            onSuccess: () => {
                toast.success("Message envoyé avec succès !")
                setIsSuccess(true)
                form.reset()
                setTimeout(() => setIsSuccess(false), 5000)
            },
            onError: (error) => {
                toast.error("Une erreur est survenue. Veuillez réessayer.")
                console.error(error)
            },
        })
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Formulaire de contact */}
            <Card className="border-2 lg:sticky lg:top-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <MessageSquare className="h-6 w-6" />
                        Envoyer un message
                    </CardTitle>
                    <CardDescription>
                        Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess && (
                        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-green-900 dark:text-green-100">Message envoyé avec succès !</h4>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                                </p>
                            </div>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prénom*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Votre prénom" disabled={isPending} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Votre nom" disabled={isPending} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email*</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="votre@email.com" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sujet*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="L'objet de votre message" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message*</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Décrivez votre demande, question ou suggestion..."
                                                rows={5}
                                                disabled={isPending}
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                                <p className="flex items-start gap-2 text-blue-900 dark:text-blue-100">
                                    <Shield className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                                    <span>
                                        Vos données sont protégées et ne seront utilisées que pour traiter votre demande.
                                        Consultez notre{" "}
                                        <Link href="/privacy" className="text-primary hover:underline font-medium">
                                            politique de confidentialité
                                        </Link>
                                        .
                                    </span>
                                </p>
                            </div>

                            {isPending ? (
                                <ButtonLoader className="w-full">Envoi en cours...</ButtonLoader>
                            ) : (
                                <Button type="submit" className="w-full" size="lg">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Envoyer le message
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Informations de contact */}
            <div className="space-y-6">
                {/* Contact direct */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Contact direct
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Support général</h3>
                            <p className="text-sm text-muted-foreground">
                                Pour toute question sur l'utilisation de Tradelab Studio
                            </p>
                            <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline font-medium">
                                contact@tradelab-studio.fr
                            </a>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-medium mb-2">Données personnelles</h3>
                            <p className="text-sm text-muted-foreground">
                                Questions RGPD, suppression de compte, droits utilisateur
                            </p>
                            <a href="mailto:contact@tradelab-studio.fr" className="text-primary hover:underline font-medium">
                                contact@tradelab-studio.fr
                            </a>
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ rapide */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Questions fréquentes
                        </CardTitle>
                        <CardDescription>Consultez notre FAQ avant de nous contacter</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="border rounded-lg p-3">
                            <h4 className="font-medium text-sm mb-1">L'argent est-il réel ?</h4>
                            <p className="text-xs text-muted-foreground">
                                Non, Tradelab Studio utilise uniquement de l'argent virtuel à des fins éducatives.
                            </p>
                        </div>

                        <div className="border rounded-lg p-3">
                            <h4 className="font-medium text-sm mb-1">Les données sont-elles en temps réel ?</h4>
                            <p className="text-xs text-muted-foreground">
                                Oui, nous utilisons des données de marché réelles via l'API Alpaca.
                            </p>
                        </div>

                        <div className="border rounded-lg p-3">
                            <h4 className="font-medium text-sm mb-1">Le service est-il gratuit ?</h4>
                            <p className="text-xs text-muted-foreground">
                                Oui, Tradelab Studio est entièrement gratuit et le restera.
                            </p>
                        </div>

                        <Button variant="outline" asChild className="w-full">
                            <Link href="/FAQ">Voir toutes les FAQ</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Signaler un bug */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bug className="h-5 w-5" />
                            Signaler un problème technique
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                            Vous avez trouvé un bug ou rencontré un problème technique ? Aidez-nous à améliorer Tradelab Studio !
                        </p>
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>Informations utiles à inclure :</strong>
                            </p>
                            <ul className="list-disc ml-4 text-muted-foreground space-y-1">
                                <li>Navigateur utilisé (Chrome, Firefox, Safari...)</li>
                                <li>Description détaillée du problème</li>
                                <li>Étapes pour reproduire le bug</li>
                                <li>Capture d'écran si possible</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
