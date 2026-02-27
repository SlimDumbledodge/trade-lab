import {
    Alert,
    Asset,
    ASSET_PRICE_PERIOD,
    Favorite,
    InvestmentPlan,
    MarketStatusType,
    Notification,
    Order,
    OrderAction,
    OrderExpiresType,
    OrderType,
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

export const getMarketStatus = (token?: string): Promise<MarketStatusType> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/market-status`, token)

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

export const forgotPassword = (email: string): Promise<{ message: string }> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/forgot-password`, undefined, {
        method: "POST",
        body: JSON.stringify({ email }),
    })

export const resetPassword = (token: string, newPassword: string): Promise<{ message: string }> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/reset-password`, undefined, {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
    })

export const getFavorites = (token?: string): Promise<Favorite[]> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/favorites`, token)

export const processAddFavorite = (assetId: number, token?: string) =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/favorites`, token, {
        method: "POST",
        body: JSON.stringify({ assetId }),
    })

export const processRemoveFavorite = (assetId: number, token?: string) =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/favorites`, token, {
        method: "DELETE",
        body: JSON.stringify({ assetId }),
    })

export const sendContactMessage = (data: {
    firstName: string
    lastName: string
    email: string
    subject: string
    message: string
}): Promise<{ message: string }> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/email/contact`, undefined, {
        method: "POST",
        body: JSON.stringify(data),
    })

export const uploadAvatar = (file: File, token?: string): Promise<{ avatarPath: string }> => {
    const formData = new FormData()
    formData.append("file", file)

    return fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/users/upload-avatar`, token, {
        method: "POST",
        body: formData,
    })
}

export const updateProfile = (
    data: { username?: string; email?: string },
    token?: string,
): Promise<{ id: number; username: string; email: string }> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/users`, token, {
        method: "PATCH",
        body: JSON.stringify(data),
    })

export const completeOnboarding = (token?: string): Promise<{ id: number; hasCompletedOnboarding: boolean }> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/users/complete-onboarding`, token, {
        method: "PATCH",
    })

// -------------------------------------------
// Alerts
// -------------------------------------------
export const getAlerts = (token?: string): Promise<Alert[]> => fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/alerts`, token)

export const createAlert = (
    data: { type: "PRICE"; config: { symbol: string; targetPrice: number; direction: "ABOVE" | "BELOW" } },
    token?: string,
): Promise<Alert> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/alerts`, token, {
        method: "POST",
        body: JSON.stringify(data),
    })

export const updateAlert = (
    alertId: number,
    data: {
        status?: "ACTIVE" | "DISABLED"
        config?: { symbol?: string; targetPrice?: number; direction?: "ABOVE" | "BELOW" }
    },
    token?: string,
): Promise<Alert> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/alerts/${alertId}`, token, {
        method: "PATCH",
        body: JSON.stringify(data),
    })

export const deleteAlert = (alertId: number, token?: string): Promise<void> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/alerts/${alertId}`, token, {
        method: "DELETE",
    })

// -------------------------------------------
// Investment Plans
// -------------------------------------------
export const getInvestmentPlans = (token?: string): Promise<InvestmentPlan[]> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/investment-plans`, token)

export const createInvestmentPlan = (
    data: { assetId: number; frequency: string; firstExecution: string; amount: number },
    token?: string,
): Promise<InvestmentPlan> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/investment-plans`, token, {
        method: "POST",
        body: JSON.stringify(data),
    })

export const updateInvestmentPlan = (
    planId: number,
    data: { frequency: string; firstExecution: string; amount: number },
    token?: string,
): Promise<InvestmentPlan> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/investment-plans/${planId}`, token, {
        method: "PATCH",
        body: JSON.stringify(data),
    })

export const deleteInvestmentPlan = (planId: number, token?: string): Promise<InvestmentPlan> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/investment-plans/${planId}`, token, {
        method: "DELETE",
    })

// -------------------------------------------
// Orders
// -------------------------------------------
export const getAllOrders = (token?: string): Promise<Order[]> => fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/orders`, token)

export const getOrders = (assetId: number, token?: string): Promise<Order[]> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/orders/asset/${assetId}`, token)

export const createOrder = (
    data: {
        assetId: number
        type: OrderType
        action: OrderAction
        expiresType: OrderExpiresType
        quantity: string
        targetPrice: string
    },
    token?: string,
): Promise<Order> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/orders`, token, {
        method: "POST",
        body: JSON.stringify(data),
    })

export const deleteOrder = (orderId: number, token?: string): Promise<Order> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/orders/${orderId}`, token, {
        method: "DELETE",
    })

// -------------------------------------------
// Notifications
// -------------------------------------------
export const getNotifications = (token?: string): Promise<Notification[]> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/notifications`, token)

export const markNotificationAsRead = (notificationId: number, token?: string): Promise<void> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/notifications/${notificationId}/read`, token, {
        method: "PATCH",
    })

export const markAllNotificationsAsRead = (token?: string): Promise<void> =>
    fetcher(`${process.env.NEXT_PUBLIC_NEST_API_URL}/notifications/read-all`, token, {
        method: "PATCH",
    })
