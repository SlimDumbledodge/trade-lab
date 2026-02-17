"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "../theme/ModeToggle"
import { ReactNode, Suspense } from "react"
import MarketOpenBadge from "../ui/market-status-badge"

export function SiteHeader({ headerTitle: _headerTitle }: { headerTitle: ReactNode }) {
    return (
        <header className="relative z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 overflow-hidden">
                <SidebarTrigger className="-ml-1 shrink-0" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 shrink-0" />
                <Suspense fallback={<p>Chargement du status du marché...</p>}>
                    <MarketOpenBadge />
                </Suspense>

                <div className="ml-auto flex items-center gap-4">
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
