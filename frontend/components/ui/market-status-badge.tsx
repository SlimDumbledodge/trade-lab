'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type MarketStatusBadgeProps = {
    isOpen: boolean;
    className?: string;
};

export function MarketStatusBadge({ isOpen, className }: MarketStatusBadgeProps) {
    return (
        <Badge
            className={cn(
                'relative flex items-center gap-2 px-3 py-1 rounded-full shadow-none',
                isOpen ? 'bg-emerald-600/10 text-emerald-500' : 'bg-red-600/10 text-red-500',
                className,
            )}
        >
            {/* Container du statut avec le pulse */}
            <span className="relative flex h-2 w-2">
                {/* Cercle qui pulse */}
                <span
                    className={cn(
                        'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                        isOpen ? 'bg-emerald-400' : 'bg-red-400',
                    )}
                />
                {/* Pastille centrale fixe */}
                <span className={cn('relative inline-flex h-2 w-2 rounded-full', isOpen ? 'bg-emerald-500' : 'bg-red-500')} />
            </span>

            {isOpen ? 'Marché ouvert' : 'Marché fermé'}
        </Badge>
    );
}
