'use client';
import { SectionCards } from '@/components/dashboard/section-cards';
import { PortfolioPerformanceChart } from '@/components/portfolio-performance-chart';
import { HoldingsByAssetType } from '@/components/dashboard/HoldingsByActifType';
import { HomeLayout } from '@/components/layouts/HomeLayout';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/hooks/use-fetch';
import { Portfolio } from '@/types/types';

export default function DashboardPage() {
    const { data: session } = useSession();

    const {
        data: portfolioData,
        loading,
        error,
    } = useFetch<Portfolio>({
        url: session?.accessToken ? `${process.env.NEXT_PUBLIC_NEST_API_URL}/portfolios/${session.user?.portfolioId}/info` : '', // <-- ton hook peut ignorer l'appel si l'URL est null
        token: session?.accessToken ?? undefined,
    });

    if (!session?.accessToken) return <p>Non connecté</p>;
    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!portfolioData) return <p>Introuvable</p>;

    return (
        <HomeLayout headerTitle="Dashboard">
            <SectionCards portfolio={portfolioData} />
            <div className="px-4 lg:px-6">
                <PortfolioPerformanceChart />
            </div>
            <HoldingsByAssetType />
        </HomeLayout>
    );
}
