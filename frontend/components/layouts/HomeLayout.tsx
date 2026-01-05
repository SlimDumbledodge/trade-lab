import { ReactNode } from "react"
import { AppSidebar } from "@/components/header/nav/SideBar"
import { SiteHeader } from "@/components/header/Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface HomeLayoutProps {
    children: ReactNode
    headerTitle?: ReactNode
}

export function HomeLayout({ children, headerTitle }: HomeLayoutProps) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader headerTitle={headerTitle} />
                <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
                    {" "}
                    {/* <- padding global */}
                    <div className="@container/main flex flex-1 flex-col gap-4">
                        <div className="flex flex-col gap-4 md:gap-6">{children}</div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
