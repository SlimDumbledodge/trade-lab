"use client"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { useSession } from "next-auth/react"
import { useFetch } from "@/hooks/use-fetch"
import { Portfolio } from "@/types/types"

export default function DashboardPage() {
    const { data: session } = useSession()

    const {
        data: portfolioData,
        loading,
        error,
    } = useFetch<Portfolio>({
        url: session?.accessToken ? `${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolio` : "", // <-- ton hook peut ignorer l'appel si l'URL est null
        token: session?.accessToken ?? undefined,
    })

    if (!session?.accessToken) return <p>Non connecté</p>
    if (loading) return <p>Chargement...</p>
    if (error) return <p className="text-red-600">{error}</p>
    if (!portfolioData) return <p>Introuvable</p>

    return (
        <HomeLayout headerTitle="Dashboard">
            <p>dashboard</p>
        </HomeLayout>
    )
}
