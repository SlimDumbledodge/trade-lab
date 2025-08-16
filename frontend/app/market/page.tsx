'use client';

import { useState } from 'react';
import { HomeLayout } from '@/components/layouts/HomeLayout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import Image from 'next/image';
import { PerformanceBadge } from '@/components/ui/performance-badge';

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

function Market() {
    const [tab, setTab] = useState<'stock' | 'etf' | 'crypto'>('stock');
    const filteredAssets = assets.filter((asset) => asset.type === tab);

    return (
        <HomeLayout>
            <div className="flex flex-col gap-2 px-4 py-4 lg:px-6">
                <h1 className="text-2xl font-semibold tracking-tight">Tous les produits</h1>
            </div>

            {/* Table */}
            <Tabs value={tab} onValueChange={(value: any) => setTab(value)}>
                <TabsList className="text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 pb-1 mb-2">
                    <TabsTrigger
                        value="stock"
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5"
                    >
                        Actions
                    </TabsTrigger>
                    <TabsTrigger
                        value="crypto"
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5"
                    >
                        Crypto
                    </TabsTrigger>
                    <TabsTrigger
                        value="etf"
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5"
                    >
                        ETF
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <Table>
                <TableCaption>Marché en temps réel basé sur l'API Finnhub.io</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Titre</TableHead>
                        <TableHead className="font-bold">Dernier prix</TableHead>
                        <TableHead className="font-bold">Bid</TableHead>
                        <TableHead className="font-bold">Ask</TableHead>
                        <TableHead className="font-bold">Volume</TableHead>
                        <TableHead className="font-bold">Horodatage</TableHead>
                        <TableHead className="font-bold">Aujourd&apos;hui</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredAssets.map((asset) => (
                        <TableRow key={asset.symbol} className="cursor-pointer">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image src="/apple.png" alt={asset.name} width={28} height={28} />
                                    <div className="flex flex-col">
                                        <span className="font-bold">
                                            {asset.name} ({asset.symbol})
                                        </span>
                                        <span className="text-xs text-muted-foreground">{asset.isin}</span>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>${asset.lastPrice.toFixed(2)}</TableCell>
                            <TableCell>${asset.bid.toFixed(2)}</TableCell>
                            <TableCell>${asset.ask.toFixed(2)}</TableCell>
                            <TableCell>{asset.volume.toLocaleString()}</TableCell>
                            <TableCell>{asset.timestamp}</TableCell>
                            <TableCell>
                                <PerformanceBadge change={asset.changePercent} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </HomeLayout>
    );
}

export default Market;
