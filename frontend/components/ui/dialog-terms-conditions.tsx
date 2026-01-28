"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

interface DialogTermsConditionsProps {
    children: React.ReactNode
    onAccept: () => void
}

const DialogTermsConditions = ({ children, onAccept }: DialogTermsConditionsProps) => {
    const handleAccept = () => {
        onAccept()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="gap-0 p-0 sm:max-h-[min(600px,80vh)] sm:max-w-md">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4">Conditions Générales d'Utilisation</DialogTitle>
                    <div className="text-muted-foreground px-6 py-4 text-sm">
                        <div className="flex flex-col gap-3">
                            <p className="font-medium text-foreground">
                                En vous inscrivant sur Tradelab Studio, vous acceptez les conditions suivantes :
                            </p>

                            <ol className="flex list-decimal flex-col gap-3 pl-4">
                                <li>
                                    <strong className="text-primary">Âge minimum :</strong> Vous devez être âgé d'au moins 16 ans
                                    pour utiliser ce service.
                                </li>
                                <li>
                                    <strong className="text-primary">Nature du service :</strong> Tradelab Studio est un
                                    simulateur de trading utilisant exclusivement de l'argent virtuel à des fins éducatives.
                                </li>
                                <li>
                                    <strong className="text-primary">Responsabilité du compte :</strong> Vous êtes responsable de
                                    la confidentialité de vos identifiants de connexion.
                                </li>
                                <li>
                                    <strong className="text-primary">Utilisation appropriée :</strong> N'utilisez pas le service à
                                    des fins commerciales ou pour des activités illégales.
                                </li>
                                <li>
                                    <strong className="text-primary">Données personnelles :</strong> Nous collectons et utilisons
                                    vos données conformément à notre Politique de Confidentialité.
                                </li>
                                <li>
                                    <strong className="text-primary">Modifications :</strong> Nous nous réservons le droit de
                                    modifier ces conditions à tout moment.
                                </li>
                            </ol>

                            <p className="mt-3 text-xs">
                                Pour consulter l'intégralité des conditions, visitez nos{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Conditions Générales complètes
                                </Link>
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="px-6 pb-4 sm:justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" onClick={handleAccept}>
                                J'accepte
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DialogTermsConditions
