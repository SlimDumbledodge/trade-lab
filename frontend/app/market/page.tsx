"use client"

import { HomeLayout } from "@/components/layouts/HomeLayout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import moment from "moment"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useAssets } from "@/hooks/useAssets"
import { SkeletonMarket } from "@/components/ui/skeleton-market"

function Market() {
    const { data: session } = useSession()
    const { data: assets, isLoading, error } = useAssets(session?.accessToken)
    const router = useRouter()
    if (isLoading)
        return (
            <HomeLayout headerTitle="Marché">
                <SkeletonMarket />
            </HomeLayout>
        )
    if (error) return <p>Erreur: {error.message}</p>
    if (!assets) return <p>Aucun produit trouver</p>
    console.log(assets)

    return (
        <HomeLayout headerTitle="Marché">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold tracking-tight p-0">Tous les produits</h1>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Titre</TableHead>
                        <TableHead className="font-bold text-center">Prix moyen</TableHead>
                        <TableHead className="font-bold text-center">Bid</TableHead>
                        <TableHead className="font-bold text-center">Ask</TableHead>
                        <TableHead className="font-bold text-center">Horodatage</TableHead>
                        <TableHead className="font-bold text-center">Actions</TableHead>
                        <TableHead className="font-bold text-center">Aujourd'hui</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map((asset) => (
                        <TableRow
                            key={asset.id}
                            className="cursor-pointer hover:bg-muted/50 transition"
                            onClick={() => router.push(`/market/${asset.symbol}`)}
                        >
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image
                                        className="rounded-xl shadow"
                                        src={asset.logo}
                                        alt={asset.symbol}
                                        width={28}
                                        height={28}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold">{asset.name}</span>
                                        <span className="text-xs text-muted-foreground">{asset.category}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold">{Number(asset.midPrice).toFixed(2)} €</TableCell>
                            <TableCell className="text-center font-semibold">{Number(asset.bidPrice).toFixed(2)} €</TableCell>
                            <TableCell className="text-center font-semibold">{Number(asset.askPrice).toFixed(2)} €</TableCell>
                            <TableCell className="text-center font-semibold">
                                {moment(asset.quoteTimestamp).format("HH:mm:ss:ms")}
                            </TableCell>
                            <TableCell className="text-center font-semibold">{asset.quoteVolume}</TableCell>
                            <TableCell className="text-center">
                                <span
                                    className={`font-semibold flex items-center justify-center gap-1 ${
                                        asset.todayPerformance !== null && Number(asset.todayPerformance) > 0
                                            ? "text-green-500"
                                            : asset.todayPerformance !== null && Number(asset.todayPerformance) < 0
                                              ? "text-red-500"
                                              : "text-muted-foreground"
                                    }`}
                                >
                                    {asset.todayPerformance !== null ? (
                                        <>
                                            {Number(asset.todayPerformance) > 0 ? (
                                                <TrendingUp size={14} fill="currentColor" />
                                            ) : Number(asset.todayPerformance) < 0 ? (
                                                <TrendingDown size={14} fill="currentColor" />
                                            ) : null}
                                            {Number(asset.todayPerformance).toFixed(2)} %
                                        </>
                                    ) : (
                                        "N/A"
                                    )}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </HomeLayout>
    )
}

export default Market
