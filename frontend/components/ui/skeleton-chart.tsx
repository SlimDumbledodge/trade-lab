import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonChart() {
    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Graphique */}
            <Skeleton className="h-[400px] w-full mt-4 rounded-lg" />
        </div>
    )
}
