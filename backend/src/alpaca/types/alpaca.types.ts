// ⏱️ Tous les timeframes supportés par Alpaca
export enum TimeframeEnum {
    // Minutes
    ONE_MIN = "1Min",
    FIVE_MIN = "5Min",
    FIFTEEN_MIN = "15Min",
    THIRTY_MIN = "30Min",
    FIFTY_NINE_MIN = "59Min",

    // Heures
    ONE_HOUR = "1Hour",
    TWO_HOUR = "2Hour",
    SIX_HOUR = "6Hour",
    TWELVE_HOUR = "12Hour",
    TWENTY_THREE_HOUR = "23Hour",

    // Jours / Semaines / Mois
    ONE_DAY = "1Day",
    ONE_WEEK = "1Week",
    ONE_MONTH = "1Month",
    THREE_MONTH = "3Month",
    SIX_MONTH = "6Month",
    TWELVE_MONTH = "12Month",
}

// ⚙️ Type principal pour les paramètres de requête "GET /v2/stocks/bars"
export type HistoricalBarsType = {
    /** Liste des symboles séparés par des virgules (AAPL,MSFT,TSLA...) */
    symbols: string[]
    /** Timeframe des barres à récupérer (ex: 1Day, 1Week...) */
    timeframe: TimeframeEnum

    /** Date de début incluse (YYYY-MM-DD ou format RFC-3339) */
    start?: string
    /** Date de fin incluse (YYYY-MM-DD ou format RFC-3339) */
    end?: string

    /** Nombre maximum de barres à renvoyer (1–10000, défaut 1000) */
    limit?: number

    /** Type d’ajustement : raw | split | dividend | spin-off | all | combinés (ex: split,dividend) */
    adjustment?: "raw" | "split" | "dividend" | "spin-off" | "all" | string

    /** Date as-of utilisée pour les renommages (ex: META/FB) */
    asof?: string

    /** Source de données : sip (défaut) | iex | boats | otc */
    feed?: "sip" | "iex" | "boats" | "otc"

    /** Devise des prix (USD par défaut) */
    currency?: "USD" | "EUR" | "GBP" | string

    /** Token de pagination renvoyé par Alpaca pour continuer une requête */
    page_token?: string

    /** Ordre de tri : asc (défaut) ou desc */
    sort?: "asc" | "desc"
}

// ✅ Réponse typée pour les barres Alpaca
export type AlpacaBar = {
    /** Timestamp RFC-3339 */
    t: string
    /** Prix d’ouverture */
    o: number
    /** Plus haut */
    h: number
    /** Plus bas */
    l: number
    /** Prix de clôture */
    c: number
    /** Volume échangé (nombre d’actions) */
    v: number
    /** Nombre de transactions dans la barre */
    n: number
    /** Prix moyen pondéré par le volume */
    vw: number
}

// ✅ Structure globale renvoyée par l’API
export type AlpacaBarsResponse = {
    bars: {
        [symbol: string]: AlpacaBar[]
    }
    next_page_token?: string
}
