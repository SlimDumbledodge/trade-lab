"use client"

import { HomeLayout } from "@/components/layouts/HomeLayout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import moment from "moment"
import { TrendingUp, TrendingDown, Store } from "lucide-react"
import { useAssets } from "@/hooks/useAssets"
import { SkeletonMarket } from "@/components/ui/skeleton-market"
import { useEffect } from "react"

function Market() {
    useEffect(() => {
        document.title = "Tradelab Studio - Marché"
    }, [])

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

    return (
        <HomeLayout headerTitle="Marché">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/20 to-cyan-500/20 ring-1 ring-teal-500/20">
                    <Store className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Marché</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Explorez tous les produits disponibles et investissez
                    </p>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Titre</TableHead>
                        <TableHead className="font-bold text-center">Prix moyen</TableHead>
                        <TableHead className="font-bold text-center hidden lg:table-cell">Bid</TableHead>
                        <TableHead className="font-bold text-center hidden lg:table-cell">Ask</TableHead>
                        <TableHead className="font-bold text-center hidden xl:table-cell">Horodatage</TableHead>
                        <TableHead className="font-bold text-center hidden md:table-cell">Volume</TableHead>
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
                                        width={35}
                                        height={35}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold">{asset.name}</span>
                                        <span className="text-xs text-muted-foreground">{asset.category}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold">{Number(asset.midPrice).toFixed(2)} €</TableCell>
                            <TableCell className="text-center font-semibold hidden lg:table-cell">
                                {Number(asset.bidPrice).toFixed(2)} €
                            </TableCell>
                            <TableCell className="text-center font-semibold hidden lg:table-cell">
                                {Number(asset.askPrice).toFixed(2)} €
                            </TableCell>
                            <TableCell className="text-center font-semibold hidden xl:table-cell">
                                {moment(asset.quoteTimestamp).format("HH:mm:ss:ms")}
                            </TableCell>
                            <TableCell className="text-center font-semibold hidden md:table-cell">{asset.quoteVolume}</TableCell>
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
