export interface PriceAlertConfig {
    symbol: string
    targetPrice: number
    direction: "ABOVE" | "BELOW"
}
