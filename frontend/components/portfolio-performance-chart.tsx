'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export const description = 'Graphique de performance du portefeuille';

function generatePortfolioData(): { date: string; value: number }[] {
    const startDate = new Date('2024-08-08');
    const days = 365;
    let value = 10000;
    const data = [];

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const changePercent = (Math.random() * 4 - 2) / 100;
        value *= 1 + changePercent;

        data.push({
            date: date.toISOString().split('T')[0],
            value: parseFloat(value.toFixed(2)),
        });
    }

    return data;
}

const portfolioData = generatePortfolioData().filter((d) => new Date(d.date) <= new Date());

const chartConfig = {
    value: {
        label: 'Valeur du portefeuille ',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

export function PortfolioPerformanceChart() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('365d');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('7d');
        }
    }, [isMobile]);

    const filteredData = portfolioData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date(portfolioData[portfolioData.length - 1].date);
        let daysToSubtract = 0;
        switch (timeRange) {
            case '1d':
                daysToSubtract = 1;
                break;
            case '7d':
                daysToSubtract = 7;
                break;
            case '30d':
                daysToSubtract = 30;
                break;
            case '90d':
                daysToSubtract = 90;
                break;
            case '365d':
            default:
                daysToSubtract = 365;
                break;
        }

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Performance du portefeuille</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">Évolution sur les dernières périodes</span>
                    <span className="@[540px]/card:hidden">Historique</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="1d">1 jour</ToggleGroupItem>
                        <ToggleGroupItem value="7d">7 jours</ToggleGroupItem>
                        <ToggleGroupItem value="30d">30 jours</ToggleGroupItem>
                        <ToggleGroupItem value="90d">3 mois</ToggleGroupItem>
                        <ToggleGroupItem value="365d">1 an</ToggleGroupItem>
                    </ToggleGroup>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('fr-FR', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={40}
                            tickFormatter={(value) =>
                                `$${Intl.NumberFormat('en-US', {
                                    notation: 'compact',
                                    compactDisplay: 'short',
                                    maximumFractionDigits: 1,
                                }).format(value)}`
                            }
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString('fr-FR', {
                                            month: 'short',
                                            day: 'numeric',
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />
                        <Area dataKey="value" type="monotone" fill="url(#fillPortfolio)" stroke="var(--primary)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
