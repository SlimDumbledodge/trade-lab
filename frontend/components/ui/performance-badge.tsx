'use client';

import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type PerformanceBadgeProps = {
    change: number;
    round?: number;
    className?: string;
    animated?: boolean;
};

export function PerformanceBadge({ change, round, className, animated = false }: PerformanceBadgeProps) {
    const isPositive = change >= 0;
    const Icon = isPositive ? IconTrendingUp : IconTrendingDown;
    const value = round ? Number(change.toFixed(round)) : change;
    const displayValue = isPositive ? `+${value}` : `${value}`;

    const [flash, setFlash] = useState(false);

    useEffect(() => {
        if (!animated) return;
        setFlash(true);
        const timeout = setTimeout(() => setFlash(false), 1200);
        return () => clearTimeout(timeout);
    }, [change, animated]);

    return (
        <Badge
            className={cn(
                'shadow-none rounded-full flex items-center gap-1 transition-colors',
                isPositive ? 'bg-emerald-600/20 text-emerald-500' : 'bg-red-600/20 text-red-500',
                flash && animated && (isPositive ? 'animate-pulse-green' : 'animate-pulse-red'),
                className,
            )}
        >
            <Icon className="inline-block" size={16} />
            {displayValue}%
        </Badge>
    );
}
