'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HomeLayout } from '@/components/layouts/HomeLayout';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Actif, Company, TransactionType } from '@/types/types';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFetch } from '@/hooks/use-fetch';

export default function CompanyPage() {
    const { data: session } = useSession();
    const params = useParams();
    const symbol = params?.symbol as string;

    const [quantity, setQuantity] = useState<string>('');
    const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.BUY);

    const {
        data: actif,
        loading: actifLoading,
        error: actifError,
    } = useFetch<Actif>({
        url: `${process.env.NEXT_PUBLIC_NEST_API_URL}/actifs/${symbol}`,
        token: session?.accessToken,
    });

    const {
        data: profile,
        loading: profileLoading,
        error: profileError,
    } = useFetch<Company>({
        url: `${process.env.NEXT_PUBLIC_NEST_API_URL}/actifs/${symbol}/profile`,
        token: session?.accessToken,
    });

    const handleTransferActif = async () => {
        if (!session?.accessToken) return;

        await toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    await new Promise((r) => setTimeout(r, 800));

                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolios/${session.user?.portfolioId}/${transactionType?.toLowerCase()}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${session.accessToken}`,
                            },
                            method: 'POST',
                            body: JSON.stringify({ actifId: actif?.id, quantity: Number(quantity) }),
                        },
                    );

                    if (!res.ok) {
                        throw new Error(`API request failed with status ${res.status}`);
                    }

                    const data = await res.json();
                    setQuantity('');
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            }),
            {
                loading: 'Transfert en cours...',
                success: 'Transfert réussi',
                error: 'Échec du transfert',
            },
        );
    };

    if (actifLoading || profileLoading) return <p>Chargement...</p>;
    if (actifError || profileError) return <p className="text-red-600">{actifError || profileError}</p>;
    if (!actif || !profile) return <p>Introuvable</p>;

    return (
        <HomeLayout headerTitle={profile.name}>
            <div className="p-6 grid grid-cols-4 gap-6">
                {/* Colonne principale */}
                <div className="col-span-3 space-y-6">
                    {/* Bouton retour */}
                    <Link href="/market">
                        <Button variant="ghost" className="flex items-center gap-2 mb-4">
                            <ArrowLeft className="h-4 w-4" />
                            Retour au marché
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Image
                                src={profile.logo || '/placeholder-logo.png'}
                                alt={profile.name || 'Company Logo'}
                                width={60}
                                height={60}
                                className="w-16 h-16 object-contain rounded-xl shadow"
                            />
                            <div>
                                <h1 className="text-2xl font-bold">{profile.name}</h1>
                                <p className="text-gray-600">
                                    {profile.ticker} • {profile.exchange}
                                </p>
                                <p className="text-sm text-gray-500">{profile.industry}</p>
                            </div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <Card className="text-white rounded-2xl">
                        <CardTitle className="px-6">Métriques</CardTitle>
                        <CardContent className="p-6 grid grid-cols-2 gap-6">
                            {/* Left column */}
                            <div className="space-y-4">
                                {/* 52 Week High / Low */}
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">52W High</p>
                                        <p>{actif.metrics?.fiftyTwoWeekHigh?.toFixed(2) ?? '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">52W Low</p>
                                        <p>{actif.metrics?.fiftyTwoWeekLow?.toFixed(2) ?? '-'}</p>
                                    </div>
                                </div>

                                {/* Date du plus bas / Vol. moyen 10j */}
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">52W Low Date</p>
                                        <p>
                                            {actif.metrics?.fiftyTwoWeekLowDate
                                                ? new Date(actif.metrics.fiftyTwoWeekLowDate).toLocaleDateString()
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">Vol. moy. 10j</p>
                                        <p>{actif.metrics?.tenDayAverageTradingVolume?.toFixed(2) ?? '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Beta</p>
                                    <p className="text-sm font-semibold">{actif.metrics?.beta?.toFixed(2) ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Perf. 1 an</p>
                                    <p className="text-sm font-semibold">
                                        {actif.metrics?.fiftyTwoWeekPriceReturnDaily?.toFixed(2) ?? '-'} %
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Menu */}
                <div className="col-span-1 space-y-6 text-left">
                    <h2 className="font-semibold text-lg">Trader</h2>
                    <Tabs defaultValue={TransactionType.BUY}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value={TransactionType.BUY} onClick={() => setTransactionType(TransactionType.BUY)}>
                                Acheter
                            </TabsTrigger>
                            <TabsTrigger value={TransactionType.SELL} onClick={() => setTransactionType(TransactionType.SELL)}>
                                Vendre
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={TransactionType.BUY}>
                            <TradeForm
                                profile={profile}
                                actif={actif}
                                quantity={quantity}
                                setQuantity={setQuantity}
                                transactionType={TransactionType.BUY}
                                handleTransfer={handleTransferActif}
                            />
                        </TabsContent>

                        <TabsContent value={TransactionType.SELL}>
                            <TradeForm
                                profile={profile}
                                actif={actif}
                                quantity={quantity}
                                setQuantity={setQuantity}
                                transactionType={TransactionType.SELL}
                                handleTransfer={handleTransferActif}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </HomeLayout>
    );
}

function TradeForm({
    profile,
    actif,
    quantity,
    setQuantity,
    transactionType,
    handleTransfer,
}: {
    profile: Company;
    actif: Actif;
    quantity: string;
    setQuantity: (q: string) => void;
    transactionType: TransactionType;
    handleTransfer: () => Promise<void>;
}) {
    const orderLabel = transactionType === TransactionType.BUY ? 'Acheter' : 'Vendre';

    return (
        <div className="grid gap-4 py-4">
            <div className="flex justify-between text-sm">
                <span>Prix unitaire</span>
                <span className="font-medium">
                    {actif.current_price} {profile.currency}
                </span>
            </div>

            <div>
                <label htmlFor="quantity" className="text-sm font-medium">
                    Nombre de titres
                </label>
                <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="flex justify-between text-sm">
                <span>Totale de l’ordre</span>
                <span className="font-medium">
                    {actif.current_price * Number(quantity)} {profile.currency}
                </span>
            </div>

            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setQuantity('')}>
                    Annuler
                </Button>
                <Button type="button" onClick={handleTransfer}>
                    {orderLabel}
                </Button>
            </div>
        </div>
    );
}
