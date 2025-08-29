'use client';

import { HomeLayout } from '@/components/layouts/HomeLayout';
import { TransactionCard } from '@/components/transaction-card';
import { Transaction } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/hooks/use-fetch';

const Page = () => {
    const { data: session } = useSession();

    const {
        data: transactions,
        loading,
        error,
    } = useFetch<Transaction[]>({
        url: session?.user?.portfolioId
            ? `${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolios/${session.user.portfolioId}/transactions`
            : '',
        token: session?.accessToken,
    });

    if (loading) return <p className="p-6 text-center">Chargement...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;

    return (
        <HomeLayout headerTitle="Transactions">
            {!transactions || transactions.length === 0 ? (
                <p className="p-6 text-center text-neutral-500">Aucune transaction</p>
            ) : (
                transactions.map((tx) => <TransactionCard key={tx.id} transaction={tx} />)
            )}
        </HomeLayout>
    );
};

export default Page;
