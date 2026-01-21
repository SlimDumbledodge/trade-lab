"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Log l'erreur côté client (à remplacer par un vrai service de logging)
        console.error("Global error caught:", error)

        // TODO: Envoyer à un service de logging (Sentry, LogRocket, etc.)
        // logError(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
                <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
                <p className="text-muted-foreground">Désolé, quelque chose s'est mal passé. Veuillez réessayer.</p>
                {process.env.NODE_ENV === "development" && (
                    <details className="text-left p-4 rounded text-sm">
                        <summary className="cursor-pointer font-semibold">Détails de l'erreur (dev only)</summary>
                        <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
                        {error.digest && <p className="mt-2 text-xs text-gray-500">Digest: {error.digest}</p>}
                    </details>
                )}
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => reset()}>Réessayer</Button>
                    <Button variant="outline" onClick={() => (window.location.href = "/")}>
                        Retour à l'accueil
                    </Button>
                </div>
            </div>
        </div>
    )
}
