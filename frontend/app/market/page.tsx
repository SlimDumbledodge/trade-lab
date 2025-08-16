interface Asset {
    symbol: string;
    name: string;
    isin: string;
    lastPrice: number;
    changePercent: number;
    bid: number;
    ask: number;
    volume: number;
    timestamp: string;
    type: 'stock' | 'etf' | 'crypto';
}

const assets: Asset[] = [
    // Actions
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        isin: 'US0378331005',
        lastPrice: 175.12,
        changePercent: 1.2,
        bid: 175.0,
        ask: 175.5,
        volume: 32000000,
        timestamp: '2025-08-15 10:45',
        type: 'stock',
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        isin: 'US88160R1014',
        lastPrice: 720.45,
        changePercent: -0.8,
        bid: 719.8,
        ask: 721.0,
        volume: 28000000,
        timestamp: '2025-08-15 10:46',
        type: 'stock',
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        isin: 'US5949181045',
        lastPrice: 305.7,
        changePercent: 2.1,
        bid: 305.5,
        ask: 306.0,
        volume: 19000000,
        timestamp: '2025-08-15 10:49',
        type: 'stock',
    },

    // ETF
    {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        isin: 'US78462F1030',
        lastPrice: 445.32,
        changePercent: 0.5,
        bid: 445.0,
        ask: 445.5,
        volume: 12000000,
        timestamp: '2025-08-15 10:50',
        type: 'etf',
    },
    {
        symbol: 'QQQ',
        name: 'Invesco QQQ Trust',
        isin: 'US46090E1038',
        lastPrice: 370.25,
        changePercent: -0.3,
        bid: 370.0,
        ask: 370.5,
        volume: 8000000,
        timestamp: '2025-08-15 10:51',
        type: 'etf',
    },

    // Crypto
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        isin: 'CRYPTO-BTC',
        lastPrice: 64000,
        changePercent: 3.1,
        bid: 63900,
        ask: 64100,
        volume: 900000,
        timestamp: '2025-08-15 10:52',
        type: 'crypto',
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        isin: 'CRYPTO-ETH',
        lastPrice: 3250,
        changePercent: -1.5,
        bid: 3245,
        ask: 3255,
        volume: 600000,
        timestamp: '2025-08-15 10:53',
        type: 'crypto',
    },
];
