"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconLayoutDashboard, type Icon } from "@tabler/icons-react"

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                {/* Dashboard */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Dashboard"
                            className={`min-w-8 duration-200 ease-linear ${
                                pathname.startsWith("/dashboard") ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                            }`}
                        >
                            <Link href="/dashboard">
                                <IconLayoutDashboard />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Autres liens */}
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = pathname.startsWith(`/${item.url}`)
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    className={`duration-200 ease-linear ${
                                        isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                                    }`}
                                >
                                    <Link href={`/${item.url}`}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
