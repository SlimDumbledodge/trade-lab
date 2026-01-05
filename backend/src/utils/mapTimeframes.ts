import { TimeframeEnum } from "src/alpaca/types/alpaca.types"
import { ASSET_PRICE_PERIOD } from "src/assets-price/types/types"

export function mapTimeframes(period: ASSET_PRICE_PERIOD): TimeframeEnum {
    switch (period) {
        case ASSET_PRICE_PERIOD.ONE_DAY:
            return TimeframeEnum.ONE_MIN
        case ASSET_PRICE_PERIOD.ONE_WEEK:
            return TimeframeEnum.ONE_HOUR
        case ASSET_PRICE_PERIOD.ONE_MONTH:
            return TimeframeEnum.ONE_HOUR
        case ASSET_PRICE_PERIOD.SIX_MONTHS:
            return TimeframeEnum.ONE_DAY
        case ASSET_PRICE_PERIOD.ONE_YEAR:
            return TimeframeEnum.ONE_DAY
        case ASSET_PRICE_PERIOD.FIVE_YEARS:
            return TimeframeEnum.ONE_WEEK
    }
}
