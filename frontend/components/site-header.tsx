'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from './theme/mode-toggle';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { MarketStatusBadge } from './ui/market-status-badge';

export function SiteHeader({ headerTitle }: { headerTitle: ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const url = process.env.NEXT_PUBLIC_NEST_API_URL + '/market-status';
    const fetcher = async (url: string) => {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Erreur API ${res.status}`);
        }

        const json = await res.json();
        return json.data;
    };

    const shouldFetch = !!session?.accessToken;

    const {
        data: isMarketOpen,
        error,
        isLoading,
    } = useSWR(shouldFetch ? url : null, fetcher, {
        refreshInterval: 1000,
        revalidateOnFocus: false,
        dedupingInterval: 1000,
    });

    if (isLoading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">
                    {headerTitle ?? pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(2)}
                </h1>
                <div className="ml-auto flex items-center gap-4">
                    <MarketStatusBadge isOpen={isMarketOpen} />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
