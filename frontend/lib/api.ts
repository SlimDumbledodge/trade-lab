import {
    Asset,
    ASSET_PRICE_PERIOD,
    AssetPrice,
    PaginatedTransactions,
    Portfolio,
    PORTFOLIO_PERFORMANCE_PERIOD,
    PortfolioAsset,
    Transaction,
    TransactionType,
} from "@/types/types"
import { fetcher } from "./fetcher"
import { PricePoint } from "@/components/charts/AssetPriceChart"

export const getPortfolio = (period: PORTFOLIO_PERFORMANCE_PERIOD, token?: string): Promise<Portfolio> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolio/${period}`, token)

export const getTransactions = (page?: number, limit?: number, token?: string): Promise<PaginatedTransactions> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/transactions?page=${page}&limit=${limit}`, token)

export const getAssets = (token?: string): Promise<Asset[]> => fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/assets`, token)
export const getAsset = (symbol: string, token?: string): Promise<Asset> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/assets/${symbol}`, token)

export const getAssetPrices = (symbol: string, period: ASSET_PRICE_PERIOD, token?: string): Promise<PricePoint[]> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/assets-price/${symbol}/${period}`, token)

export const getPortfolioAsset = (symbol: string, token?: string): Promise<PortfolioAsset> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolios-assets/${symbol}`, token)

export const getPortfolioAssets = (token?: string): Promise<PortfolioAsset[]> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolios-assets`, token)

export const processTradeExecution = (
    transactionType: TransactionType,
    assetId: number,
    quantity: number,
    token?: string,
): Promise<Transaction> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/transactions/${transactionType}`, token, {
        method: "POST",
        body: JSON.stringify({ assetId, quantity }),
    })
