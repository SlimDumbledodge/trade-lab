import { ASSET_PRICE_PERIOD } from "@/types/types"

export const PERIODS = [
    { label: "1J", value: ASSET_PRICE_PERIOD.ONE_DAY },
    { label: "1S", value: ASSET_PRICE_PERIOD.ONE_WEEK },
    { label: "1M", value: ASSET_PRICE_PERIOD.ONE_MONTH },
    { label: "6M", value: ASSET_PRICE_PERIOD.SIX_MONTHS },
    { label: "1A", value: ASSET_PRICE_PERIOD.ONE_YEAR },
    { label: "5A", value: ASSET_PRICE_PERIOD.FIVE_YEARS },
]
