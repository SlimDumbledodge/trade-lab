'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HomeLayout } from '@/components/layouts/HomeLayout';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ExternalLink, Phone, Globe, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/animate-ui/radix/dialog';
import { IconButton } from '@/components/animate-ui/buttons/icon';

interface CompanyProfile {
    id: number;
    ticker: string;
    name: string;
    logo: string;
    industry: string;
    exchange: string;
    marketEntryDate: string;
    marketCapitalization?: number;
    sharesOutstanding?: number;
    webUrl?: string;
    phone?: string;
    country?: string;
    currency?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function CompanyPage() {
    const params = useParams();
    const symbol = params?.symbol as string;
    const { data: session } = useSession();

    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!symbol || !session?.accessToken) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/actifs/${symbol}/profile`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

                const data = await res.json();
                setProfile(data.data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [symbol, session?.accessToken]);

    if (loading) return <p className="p-6 text-center">Chargement...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;
    if (!profile) return <p className="p-6">Profil introuvable</p>;

    return (
        <HomeLayout headerTitle={profile.name}>
            <div className="p-6 max-w-6xl mx-auto grid grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="col-span-3 space-y-6">
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
                        <IconButton icon={Star} active={active} onClick={() => setActive(!active)} />
                    </div>

                    {/* Metrics */}
                    <Card className=" text-white rounded-2xl ">
                        <CardTitle className="px-6">Métriques</CardTitle>
                        <CardContent className="p-6 grid grid-cols-2 gap-6">
                            {/* Left column */}

                            <div className="space-y-4">
                                {/* Pér. 1J */}
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Pér. 1J</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>193,08</span>
                                        <div className="flex-1 h-1 bg-gray-700 rounded-full relative">
                                            <div className="absolute left-0 h-1 bg-green-500 rounded-full w-1/3"></div>
                                        </div>
                                        <span>195,54</span>
                                    </div>
                                </div>

                                {/* Pér. 52S */}
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Pér. 52S</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>152,00</span>
                                        <div className="flex-1 h-1 bg-gray-700 rounded-full relative">
                                            <div className="absolute left-0 h-1 bg-green-500 rounded-full w-1/2"></div>
                                        </div>
                                        <span>248,70</span>
                                    </div>
                                </div>

                                {/* Ouverture / Clôture */}
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">Ouverture</p>
                                        <p>193,98</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">Clôture</p>
                                        <p>193,78</p>
                                    </div>
                                </div>

                                {/* Bid / Ask */}
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">Bid</p>
                                        <p>194,32</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">Ask</p>
                                        <p>194,52</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Cap. Bours.</p>
                                    <p className="text-sm font-semibold">2,912 T</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400">P/E</p>
                                    <p className="text-sm font-semibold">31,41</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Beta 52S</p>
                                    <p className="text-sm font-semibold">1,11</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Rend. div.</p>
                                    <p className="text-sm font-semibold">0,46 %</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-xs text-gray-400 text-right">
                        Dernière mise à jour : {new Date(profile.updatedAt ?? '').toLocaleString()}
                    </p>
                </div>

                {/* Side Menu */}
                <div className="col-span-1 space-y-6">
                    <h2 className="font-semibold text-lg">Trader</h2>
                    <p className="text-gray-600">Achetez cette action</p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Acheter</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]" from="left">
                            <DialogHeader>
                                <DialogTitle>Achat d’action</DialogTitle>
                                <DialogDescription>
                                    Sélectionnez la quantité à acheter pour <span className="font-semibold">{profile.name}</span>{' '}
                                    ({profile.ticker}).
                                </DialogDescription>
                            </DialogHeader>

                            {/* Form */}
                            <div className="grid gap-4 py-4">
                                <div className="flex justify-between text-sm">
                                    <span>Prix unitaire</span>
                                    <span className="font-medium">
                                        {(profile as any).current_price ?? 194.32} {profile.currency}
                                    </span>
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="text-sm font-medium">
                                        Quantité
                                    </label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Coût total</span>
                                    <span className="font-medium">
                                        {((profile as any).current_price ?? 194.32) * quantity} {profile.currency}
                                    </span>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setQuantity(1)}>
                                    Annuler
                                </Button>
                                <Button
                                    type="button"
                                    // onClick={async () => {
                                    //     try {
                                    //         const res = await fetch(
                                    //             `${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolio/${portfolioId}/buy`,
                                    //             {
                                    //                 method: 'POST',
                                    //                 headers: {
                                    //                     'Content-Type': 'application/json',
                                    //                     Authorization: `Bearer ${session?.accessToken}`,
                                    //                 },
                                    //                 body: JSON.stringify({
                                    //                     actifId: profile.id,
                                    //                     quantity,
                                    //                 }),
                                    //             },
                                    //         );
                                    //         if (!res.ok) {
                                    //             const err = await res.json();
                                    //             throw new Error(err.message || "Erreur lors de l'achat");
                                    //         }
                                    //         const data = await res.json();
                                    //         console.log('Achat confirmé :', data);
                                    //         // tu peux afficher une notif ou fermer le dialog ici
                                    //     } catch (err) {
                                    //         console.error(err);
                                    //     }
                                    // }}
                                >
                                    Confirmer l’achat
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </HomeLayout>
    );
}
