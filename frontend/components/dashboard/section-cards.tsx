import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceBadge } from '../ui/performance-badge';
import { Portfolio } from '@/types/types';

type SectionCardsProps = {
    portfolio: Portfolio;
};

export function SectionCards({ portfolio }: SectionCardsProps) {
    console.log(portfolio);

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {/* Solde total */}
            <Card className="@container/card">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                        <CardDescription>Solde total</CardDescription>
                        <CardAction className="static ml-auto">
                            <PerformanceBadge change={12.5} />
                        </CardAction>
                    </div>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {portfolio.totalPortfolioValue.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' })}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
                        En progression ce mois-ci <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Inclut le solde disponible et la valeur actuelle de vos actifs.</div>
                </CardFooter>
            </Card>

            {/* Performance globale */}
            <Card className="@container/card">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                        <CardDescription>Perf. globale</CardDescription>
                        <CardAction className="static ml-auto">
                            <PerformanceBadge change={-20} />
                        </CardAction>
                    </div>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">-20%</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-red-600">
                        Baisse ce mois-ci <IconTrendingDown className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Évalue le pourcentage global de gain ou de perte de votre portefeuille.
                    </div>
                </CardFooter>
            </Card>

            {/* Capital disponible */}
            <Card className="@container/card">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                        <CardDescription>Capital disponible</CardDescription>
                        <CardAction className="static ml-auto">
                            <PerformanceBadge change={5.2} />
                        </CardAction>
                    </div>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {portfolio.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' })}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
                        Capital non investi <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Montant actuellement disponible pour de nouveaux investissements.</div>
                </CardFooter>
            </Card>

            {/* Croissance du portefeuille */}
            <Card className="@container/card">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                        <CardDescription>Croissance du portefeuille</CardDescription>
                        <CardAction className="static ml-auto">
                            <PerformanceBadge change={4.5} />
                        </CardAction>
                    </div>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">+4.5%</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
                        Tendance positive <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Représente la croissance globale de vos actifs sur la période actuelle.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
