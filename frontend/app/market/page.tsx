'use client';

import { useState } from 'react';
import { HomeLayout } from '@/components/layouts/HomeLayout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { PerformanceBadge } from '@/components/ui/performance-badge';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

interface Actif {
    id: number;
    symbol: string;
    sectorActivity: string;
    logo: string;
    description: string;
    type: 'Common Stock' | 'ETP' | 'CRYPTO';
    current_price: number;
    percent_change: number;
    opening_price_day: number;
    highest_price_day: number;
    lowest_price_day: number;
    previous_close_price_day: number;
    createdAt: string;
    updatedAt: string;
}

function Market() {
    const [tab, setTab] = useState<'Common Stock' | 'ETP' | 'CRYPTO'>('Common Stock');
    const { data: session } = useSession();
    const url = process.env.NEXT_PUBLIC_NEST_API_URL + '/actifs';

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

    const { data, error, isLoading } = useSWR<Actif[]>(shouldFetch ? url : null, fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: false,
        dedupingInterval: 30000,
    });

    if (isLoading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;

    const filteredActifs = (data ?? []).filter((actif) => actif.type === tab);
    console.log(data);

    return (
        <HomeLayout headerTitle="Marché">
            <div className="flex flex-col gap-2 px-4 py-4 lg:px-6">
                <h1 className="text-2xl font-semibold tracking-tight">Tous les actifs</h1>
            </div>

            {/* Onglets */}
            <Tabs value={tab} onValueChange={(value: any) => setTab(value)}>
                <TabsList className="text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 pb-1 mb-2">
                    <TabsTrigger
                        value="Common Stock"
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5"
                    >
                        Actions
                    </TabsTrigger>
                    <TabsTrigger
                        value="CRYPTO"
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5"
                    >
                        Crypto
                    </TabsTrigger>
                    <TabsTrigger
                        value="ETP"
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5"
                    >
                        ETF
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Table des actifs */}
            <Table>
                <TableCaption>Marché en temps réel basé sur ton backend</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Titre</TableHead>
                        <TableHead className="font-bold">Dernier prix</TableHead>
                        <TableHead className="font-bold">Ouverture</TableHead>
                        <TableHead className="font-bold">Plus haut</TableHead>
                        <TableHead className="font-bold">Plus bas</TableHead>
                        <TableHead className="font-bold">Clôture préc.</TableHead>
                        <TableHead className="font-bold">Aujourd&apos;hui</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredActifs.map((actif) => (
                        <TableRow key={actif.id} className="cursor-pointer">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {/* ✅ logo par défaut si pas d'images */}
                                    <Image src={actif.logo} alt={actif.symbol} width={28} height={28} />
                                    <div className="flex flex-col">
                                        <span className="font-bold">
                                            {actif.description} ({actif.symbol})
                                        </span>
                                        <span className="text-xs text-muted-foreground">#{actif.id}</span>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>${actif.current_price.toFixed(2)}</TableCell>
                            <TableCell>${actif.opening_price_day.toFixed(2)}</TableCell>
                            <TableCell>${actif.highest_price_day.toFixed(2)}</TableCell>
                            <TableCell>${actif.lowest_price_day.toFixed(2)}</TableCell>
                            <TableCell>${actif.previous_close_price_day.toFixed(2)}</TableCell>
                            <TableCell>
                                <PerformanceBadge change={actif.percent_change} round={2} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </HomeLayout>
    );
}

export default Market;
