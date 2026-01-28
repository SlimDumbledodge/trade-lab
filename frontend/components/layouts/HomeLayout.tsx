import { ReactNode } from "react"
import { AppSidebar } from "@/components/header/nav/SideBar"
import { SiteHeader } from "@/components/header/Header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Footer } from "@/components/footer/Footer"

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
            <div className="flex min-h-screen w-full">
                {/* Sidebar */}
                <AppSidebar variant="inset" />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col">
                    {/* Header */}
                    <SiteHeader headerTitle={headerTitle} />

                    {/* Main content */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        <div className="mx-auto w-full max-w-6xl">{children}</div>
                    </main>
                    <Footer />
                </div>
            </div>
        </SidebarProvider>
    )
}
