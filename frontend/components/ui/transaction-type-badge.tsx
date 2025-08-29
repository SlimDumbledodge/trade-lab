'use client';

import { Badge } from '@/components/ui/badge';
import { TransactionType } from '@/types/types';

type TransactionTypeBadgeProps = {
    type: TransactionType;
};

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
    const isBuy = type === TransactionType.BUY;

    return (
        <Badge
            className={`shadow-none rounded-full ${
                isBuy
                    ? 'bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500'
                    : 'bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500'
            }`}
        >
            {isBuy ? 'Achat' : 'Vente'}
        </Badge>
    );
}
