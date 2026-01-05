'use client';

import { useState } from 'react';
import { HomeLayout } from '@/components/layouts/HomeLayout';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/hooks/use-fetch';
import { PaginatedTransactions } from '@/types/types';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';

function getPaginationPages(current: number, total: number, delta: number = 2) {
    const pages: (number | 'ellipsis')[] = [];
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }

    pages.push(1); // toujours la première page

    if (range[0] > 2) {
        pages.push('ellipsis'); // espace avant la plage
    }

    for (const i of range) {
        pages.push(i);
    }

    if (range[range.length - 1] < total - 1) {
        pages.push('ellipsis'); // espace après la plage
    }

    if (total > 1) pages.push(total); // toujours la dernière page

    return pages;
}

const Page = () => {
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;

    const {
        data: transactions,
        loading,
        error,
    } = useFetch<PaginatedTransactions>({
        url: session?.user?.portfolioId
            ? `${process.env.NEXT_PUBLIC_NEST_API_URL}/transactions?page=${currentPage}&limit=${limit}`
            : '',
        token: session?.accessToken,
    });

    if (loading) return <p className="p-6 text-center">Chargement...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;

    const hasTransactions = transactions && transactions.items.length > 0;
    const totalPages = transactions?.meta.lastPage || 1;
    const pages = getPaginationPages(currentPage, totalPages, 2);

    return (
        <HomeLayout headerTitle="Transactions">
            {!hasTransactions ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <EmptyState
                        title="Aucune transaction !"
                        description="Vous les verrez apparaître lorsque vous ferez un achat ou une vente d’un ordre."
                        icons={[Search]}
                    />
                </div>
            ) : (
                <>
                    {transactions.items.map((tx) => (
                        <TransactionCard key={tx.id} transaction={tx} />
                    ))}

                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                        }}
                                    />
                                </PaginationItem>

                                {pages.map((page, idx) =>
                                    page === 'ellipsis' ? (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === currentPage}
                                                className="rounded-full"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(page);
                                                }}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ),
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </HomeLayout>
    );
};

export default Page;
