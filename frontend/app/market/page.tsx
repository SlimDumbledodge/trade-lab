"use client"

import { useState } from "react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { PerformanceBadge } from "@/components/ui/performance-badge"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Asset } from "@/types/types"

function Market() {
    const { data: session } = useSession()
    const router = useRouter()
    const url = process.env.NEXT_PUBLIC_NEST_API_URL + "/assets"

    const fetcher = async (url: string) => {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        })

        if (!res.ok) {
            throw new Error(`Erreur API ${res.status}`)
        }

        const json = await res.json()
        return json.data
    }

    const shouldFetch = !!session?.accessToken

    const { data, error, isLoading } = useSWR<Asset[]>(shouldFetch ? url : null, fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: false,
        dedupingInterval: 30000,
    })

    if (isLoading) return <p>Chargement...</p>
    if (error) return <p>Erreur: {error.message}</p>
    if (!data) return <p>Aucun produit trouver</p>

    return (
        <HomeLayout headerTitle="Marché">
            <div className="flex flex-col gap-2 px-4 py-4 lg:px-6">
                <h1 className="text-2xl font-semibold tracking-tight">Tous les actifs</h1>
            </div>

            {/* Table des actifs */}
            <Table>
                <TableCaption>Marché en temps réel basé sur ton backend</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Titre</TableHead>
                        <TableHead className="font-bold">Dernier prix</TableHead>
                        <TableHead className="font-bold">Ouverture</TableHead>
                        <TableHead className="font-bold">Plus haut</TableHead>
                        <TableHead className="font-bold">Plus bas</TableHead>
                        <TableHead className="font-bold">Clôture préc.</TableHead>
                        <TableHead className="font-bold">Aujourd&apos;hui</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((actif) => (
                        <TableRow
                            key={actif.id}
                            className="cursor-pointer hover:bg-muted/50 transition"
                            onClick={() => router.push(`/market/${actif.symbol}`)}
                        >
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image className="rounded-xl shadow" src="" alt={actif.symbol} width={28} height={28} />
                                    <div className="flex flex-col">
                                        <span className="font-bold">
                                            {actif.description} ({actif.symbol})
                                        </span>
                                        <span className="text-xs text-muted-foreground">#{actif.id}</span>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </HomeLayout>
    )
}

export default Market
