'use client';

import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type PerformanceBadgeProps = {
    change: number; // en pourcentage
    className?: string; // pour override
};

export function PerformanceBadge({ change, className }: PerformanceBadgeProps) {
    const isPositive = change >= 0;
    const Icon = isPositive ? IconTrendingUp : IconTrendingDown;

    return (
        <Badge className={`${className ?? ''} ${isPositive ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            <Icon className="mr-1 size-4" />
            {change > 0 ? '+' : ''}
            {change}%
        </Badge>
    );
}
