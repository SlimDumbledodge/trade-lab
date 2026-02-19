"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, TrendingDown, Heart, Sparkles } from "lucide-react"
import { PriceChange } from "@/components/ui/price-change"
import { useFavorites } from "@/hooks/useFavorites"
import { useRemoveFavorite } from "@/mutations/useFavorite"
import { SkeletonMarket } from "@/components/ui/skeleton-market"
import toast from "react-hot-toast"

export default function FavoritesPage() {
    useEffect(() => {
        document.title = "Tradelab Studio - Favoris"
    }, [])

    const { data: session } = useSession()
    const { data: favorites, isLoading } = useFavorites(session?.accessToken)
    const removeFavorite = useRemoveFavorite()
    const router = useRouter()

    if (isLoading) {
        return (
            <HomeLayout headerTitle="Favoris">
                <SkeletonMarket />
            </HomeLayout>
        )
    }

    const items = favorites ?? []
    const totalGainers = items.filter((f) => Number(f.asset.todayPerformance) > 0).length
    const totalLosers = items.filter((f) => Number(f.asset.todayPerformance) < 0).length
    const avgChange = items.length > 0 ? items.reduce((sum, f) => sum + Number(f.asset.todayPerformance), 0) / items.length : 0

    return (
        <HomeLayout headerTitle="Favoris">
            {/* Page Header */}
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 ring-1 ring-yellow-500/20">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mes Favoris</h1>
                        <p className="text-sm text-muted-foreground">Suivez vos actifs préférés en un coup d&apos;œil</p>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 transition-all hover:border-primary/20 hover:shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3.5 w-3.5 text-yellow-500" />
                        Total favoris
                    </div>
                    <p className="mt-1 text-xl font-bold">{items.length}</p>
                </div>
                <div className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 transition-all hover:border-green-500/20 hover:shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        En hausse
                    </div>
                    <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">{totalGainers}</p>
                </div>
                <div className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 transition-all hover:border-red-500/20 hover:shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        En baisse
                    </div>
                    <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">{totalLosers}</p>
                </div>
                <div className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 transition-all hover:border-primary/20 hover:shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Perf. moyenne
                    </div>
                    <p
                        className={`mt-1 text-xl font-bold ${
                            avgChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                    >
                        {avgChange >= 0 ? "+" : ""}
                        {avgChange.toFixed(2)}%
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="mt-6">
                {items.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <EmptyState
                            title="Aucun favori trouvé"
                            description="Ajoutez des actifs à vos favoris depuis le marché."
                            icons={[Heart, Star, Sparkles]}
                            action={{
                                label: "Explorer le marché",
                                onClick: () => router.push("/market"),
                            }}
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((fav, i) => {
                            const perf = Number(fav.asset.todayPerformance)
                            return (
                                <div
                                    key={fav.id}
                                    className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 transition-all hover:border-primary/20 hover:shadow-sm cursor-pointer"
                                    style={{ animationDelay: `${i * 40}ms` }}
                                    onClick={() => router.push(`/market/${fav.asset.symbol}`)}
                                >
                                    <Image
                                        className="rounded-lg shadow-sm ring-1 ring-border/50"
                                        src={fav.asset.logo}
                                        alt={fav.asset.symbol}
                                        width={36}
                                        height={36}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm truncate">{fav.asset.name}</span>
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                                                {fav.asset.category}
                                            </Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{fav.asset.symbol}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <p className="font-bold text-sm">{Number(fav.asset.lastPrice).toFixed(2)} €</p>
                                        <PriceChange value={perf} unit="%" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-yellow-500 hover:text-yellow-400 shrink-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFavorite.mutate(
                                                { assetId: fav.assetId, token: session?.accessToken },
                                                {
                                                    onSuccess: () => toast.success("Favori retiré"),
                                                    onError: () => toast.error("Erreur lors de la suppression du favori"),
                                                },
                                            )
                                        }}
                                    >
                                        <Star className="h-4 w-4 fill-current" />
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </HomeLayout>
    )
}
