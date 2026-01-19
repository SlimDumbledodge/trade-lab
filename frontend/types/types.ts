// -------------------------------------------
// Auth / Users

import { PortfolioPoint } from "@/components/charts/PortfolioPerformanceChart"

// -------------------------------------------
export type LoginForm = {
    email: string
    password: string
}

export type AuthResponse = {
    accessToken: string
    user: User
}

// -------------------------------------------
// User model
// -------------------------------------------

export type User = {
    id: number
    username: string
    email: string
    createdAt: string // DateTime en ISO côté frontend
    portfolio?: Portfolio | null
}

// -------------------------------------------
// Portfolio model
// -------------------------------------------

export type Portfolio = {
    id: number
    userId: number
    cashBalance: number // Decimal converti en number côté frontend
    holdingsValue: number
    createdAt: string
    points: PortfolioPoint[]
    assets: PortfolioAsset[]
    history: PortfolioHistory[]
    transactions: Transaction[]
}

// -------------------------------------------
// Actif (Asset) model
// -------------------------------------------

export type Asset = {
    id: number
    symbol: string
    name: string
    lastPrice: string // Decimal côté Prisma devient string en JSON
    midPrice: string
    bidPrice: string
    askPrice: string
    quoteTimestamp: string
    quoteVolume: string
    todayPerformance: string
    logo: string
    category: string
    updatedAt: string
    prices?: AssetPrice[]
}

// -------------------------------------------
// Prix d’un actif (AssetPrice)
// -------------------------------------------

export type AssetPrice = {
    id: number
    assetId: number
    timeframe: string // TimeframeType ONE_DAY, etc.
    open: number
    high: number
    low: number
    close: number
    volume?: number | null
    recordedAt: string
}

// -------------------------------------------
// PortfolioActif (PortfolioAsset) model
// -------------------------------------------

export type PortfolioAsset = {
    id: number
    portfolioId: number
    assetId: number
    quantity: number
    averageBuyPrice: number
    holdingsValue: number
    unrealizedPnl: number
    createdAt: string
    updatedAt: string
    asset: Asset
}

// -------------------------------------------
// Transaction model
// -------------------------------------------

export enum TransactionType {
    BUY = "buy",
    SELL = "sell",
}

export type Transaction = {
    id: number
    portfolioId: number
    assetId: number
    type: TransactionType
    quantity: number
    price: number
    createdAt: string
    asset: Asset
}

// -------------------------------------------
// PortfolioHistory model
// -------------------------------------------

export type PortfolioHistory = {
    id: number
    portfolioId: number
    unrealizedPnL: number
    cashBalance: number
    recordedAt: string
}

// -------------------------------------------
// Pagination
// -------------------------------------------

export type PaginationMeta = {
    total: number
    page: number
    lastPage: number
}

export type PaginatedTransactions = {
    items: Transaction[]
    meta: PaginationMeta
}

export enum ASSET_PRICE_PERIOD {
    ONE_DAY = "1d",
    ONE_WEEK = "1s",
    ONE_MONTH = "1m",
    SIX_MONTHS = "6m",
    ONE_YEAR = "1y",
    FIVE_YEARS = "5y",
}

export enum PORTFOLIO_PERFORMANCE_PERIOD {
    ONE_DAY = "1d",
    ONE_WEEK = "1s",
    ONE_MONTH = "1m",
    ONE_YEAR = "1y",
    MAX = "max",
}
