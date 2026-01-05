"use client"

import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { Asset, ASSET_PRICE_PERIOD } from "@/types/types"
import { useFetch } from "@/hooks/use-fetch"
import { AssetPriceChart, PricePoint } from "../../../components/charts/AssetPriceChart"

export default function CompanyPage() {
    const { data: session } = useSession()
    const params = useParams()
    const symbol = params?.symbol as string

    const {
        data: asset,
        loading: assetLoading,
        error: assetError,
    } = useFetch<Asset>({
        url: `${process.env.NEXT_PUBLIC_NEST_API_URL}/assets/${symbol}`,
        token: session?.accessToken,
    })

    const {
        data: assetPrices,
        loading: assetPricesloading,
        error: assetPricesError,
    } = useFetch<PricePoint[]>({
        url: session?.accessToken
            ? `${process.env.NEXT_PUBLIC_NEST_API_URL}/assets-price/${symbol}/${ASSET_PRICE_PERIOD.FIVE_YEARS}`
            : "",
        token: session?.accessToken ?? undefined,
    })

    if (assetLoading || assetPricesloading) return <p>Chargement...</p>
    if (assetError || assetPricesError) return <p className="text-red-600">{assetError}</p>
    if (!asset || !assetPrices) return <p>Introuvable</p>
    console.log(assetPrices)

    const formatAssetPrices: PricePoint[] = assetPrices.map((price) => {
        return {
            recordedAt: price.recordedAt,
            closingPrice: price.closingPrice,
        }
    })

    return (
        <HomeLayout headerTitle={"Marché"}>
            <AssetPriceChart data={formatAssetPrices} />
        </HomeLayout>
    )
}
