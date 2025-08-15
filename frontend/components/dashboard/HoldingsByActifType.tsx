'use client';

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceBadge } from '../ui/performance-badge';

type AssetType = {
    name: string;
    amount: number;
    change: number;
};

const assetData: AssetType[] = [
    { name: 'Crypto', amount: 12500, change: 5 },
    { name: 'ETF', amount: 8320, change: 2.5 },
    { name: 'Actions', amount: 24000, change: -1.3 },
    { name: 'Métaux', amount: 4500, change: 3.0 },
];

function formatAmount(value: number) {
    return `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
    })}`;
}

export function HoldingsByAssetType() {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {assetData.map((asset) => {
                const isPositive = asset.change >= 0;

                return (
                    <Card key={asset.name} className="@container/card">
                        <CardHeader>
                            <CardDescription>{asset.name}</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {formatAmount(asset.amount)}
                            </CardTitle>
                            <CardAction>
                                <PerformanceBadge change={asset.change} />
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div
                                className={`line-clamp-1 flex gap-2 font-medium ${
                                    isPositive ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {isPositive ? 'En hausse ce mois-ci' : 'En baisse ce mois-ci'}
                                {isPositive ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
