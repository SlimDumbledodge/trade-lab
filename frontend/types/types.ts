// frontend/types.ts

// -------------------------------------------
// Auth / Users
// -------------------------------------------
export type LoginForm = {
    email: string;
    password: string;
};

export type AuthResponse = {
    accessToken: string;
    user: User;
};

// -------------------------------------------
// User model
// -------------------------------------------
export type User = {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
    subscription: 'free' | 'premium';
    portfolioId?: number | null;
};

// -------------------------------------------
// Actif model
// -------------------------------------------
export enum ActifType {
    CommonStock = 'Common Stock',
    ETP = 'ETP',
    CRYPTO = 'CRYPTO',
}

export type Actif = {
    id: number;
    description: string;
    sectorActivity: string;
    logo: string;
    symbol: string;
    type: ActifType;
    current_price: number;
    highest_price_day: number;
    lowest_price_day: number;
    opening_price_day: number;
    previous_close_price_day: number;
    percent_change: number;
    change: number;
    metrics?: Metrics | null;
};

// -------------------------------------------
// Metrics model
// -------------------------------------------
export type Metrics = {
    id: number;
    tenDayAverageTradingVolume: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekLowDate: string; // Dates côté frontend on garde string pour JSON
    fiftyTwoWeekPriceReturnDaily: number;
    beta: number;
    actifId: number;
};

// -------------------------------------------
// Company model
// -------------------------------------------
export type Company = {
    id: number;
    ticker: string;
    name: string;
    country: string;
    currency: string;
    exchange: string;
    marketEntryDate: string;
    marketCapitalization?: number;
    sharesOutstanding?: number;
    phone?: string;
    webUrl?: string;
    logo?: string;
    industry?: string;
};

// -------------------------------------------
// Portfolio model
// -------------------------------------------
export type Portfolio = {
    id: number;
    userId: number;
    balance: number;
    totalActifsValue: number;
    totalPortfolioValue: number;
    actifs: PortfolioActif[];
    transactions: Transaction[];
};

// -------------------------------------------
// PortfolioActif model
// -------------------------------------------
export type PortfolioActif = {
    id: number;
    portfolioId: number;
    actifId: number;
    quantity: number;
    averagePrice: number;
};

// -------------------------------------------
// Transaction model
// -------------------------------------------

export enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL',
}
export type Transaction = {
    id: number;
    type: TransactionType;
    quantity: number;
    priceAtExecution: number;
    actifId: number;
    portfolioId: number;
    actif?: Actif;
    createdAt: Date;
};

export type PaginationMeta = {
    total: number;
    page: number;
    lastPage: number;
};

export type PaginatedTransactions = {
    items: Transaction[];
    meta: PaginationMeta;
};
