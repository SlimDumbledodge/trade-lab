import { SectionCards } from '@/components/dashboard/section-cards';
import { PortfolioPerformanceChart } from '@/components/portfolio-performance-chart';
import { HoldingsByAssetType } from '@/components/dashboard/HoldingsByActifType';
import { HomeLayout } from '@/components/layouts/HomeLayout';

export default function DashboardPage() {
    return (
        <HomeLayout headerTitle="Dashboard">
            <SectionCards />
            <div className="px-4 lg:px-6">
                <PortfolioPerformanceChart />
            </div>
            <HoldingsByAssetType />
        </HomeLayout>
    );
}
