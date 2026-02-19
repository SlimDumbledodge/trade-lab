"use client"

import * as React from "react"
import { IconChartBar, IconChartLine, IconChartPie, IconStar, IconWallet } from "@tabler/icons-react"

import { NavMain } from "@/components/header/nav/NavMain"
import { NavUser } from "@/components/header/nav/NavUser"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"
import { Separator } from "../../ui/separator"
import Link from "next/link"

const data = {
    user: {
        name: "Amaël Rosales",
        email: "amael.rosales@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Portefeuille",
            url: "portfolio",
            icon: IconWallet,
        },
        {
            title: "Statistiques",
            url: "statistics",
            icon: IconChartPie,
        },
        {
            title: "Transactions",
            url: "transactions",
            icon: IconChartBar,
        },
        {
            title: "Marché",
            url: "market",
            icon: IconChartLine,
        },
        {
            title: "Favoris",
            url: "favorites",
            icon: IconStar,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link
                            href="/portfolio"
                            className="flex justify-center items-center gap-2 text-xs md:text-sm hover:cursor-pointer"
                        >
                            <Image src="/icon.png" alt="Logo Tradelab" width={35} height={35} />
                            <span className="font-semibold text-lg">tradelab/studio</span>
                        </Link>
                    </SidebarMenuItem>
                    <Separator className="mb-1 mt-4" />
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
