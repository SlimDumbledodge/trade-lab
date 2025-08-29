'use client';

import { Badge } from '@/components/ui/badge';
import { TransactionType } from '@/types/types';

type TransactionTypeBadgeProps = {
    type: TransactionType;
};

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
    console.log(type);
    return (
        <Badge className={`${type === TransactionType.BUY ? 'bg-green-700' : 'bg-red-700'} text-white`}>
            {type === TransactionType.BUY ? 'Achat' : 'Vente'}
        </Badge>
    );
}
