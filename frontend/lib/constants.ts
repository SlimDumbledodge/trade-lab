import { ASSET_PRICE_PERIOD, PORTFOLIO_PERFORMANCE_PERIOD } from "@/types/types"

export const ASSET_PRICE_PERIODS = [
    { label: "1J", value: ASSET_PRICE_PERIOD.ONE_DAY },
    { label: "1S", value: ASSET_PRICE_PERIOD.ONE_WEEK },
    { label: "1M", value: ASSET_PRICE_PERIOD.ONE_MONTH },
    { label: "6M", value: ASSET_PRICE_PERIOD.SIX_MONTHS },
    { label: "1A", value: ASSET_PRICE_PERIOD.ONE_YEAR },
    { label: "5A", value: ASSET_PRICE_PERIOD.FIVE_YEARS },
]

export const PORTFOLIO_PERFORMANCE_PERIODS = [
    { label: "1J", value: PORTFOLIO_PERFORMANCE_PERIOD.ONE_DAY },
    { label: "1S", value: PORTFOLIO_PERFORMANCE_PERIOD.ONE_WEEK },
    { label: "1M", value: PORTFOLIO_PERFORMANCE_PERIOD.ONE_MONTH },
    { label: "1A", value: PORTFOLIO_PERFORMANCE_PERIOD.ONE_YEAR },
    { label: "MAX", value: PORTFOLIO_PERFORMANCE_PERIOD.MAX },
]
