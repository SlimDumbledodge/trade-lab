"use client"

import * as React from "react"
import { IconCamera, IconChartBar, IconChartLine, IconFileAi, IconFileDescription, IconWallet } from "@tabler/icons-react"

import { NavMain } from "@/components/header/nav/NavMain"
import { NavUser } from "@/components/header/nav/NavUser"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"
import { Separator } from "../../ui/separator"

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
            title: "Transactions",
            url: "transactions",
            icon: IconChartBar,
        },
        {
            title: "Marché",
            url: "market",
            icon: IconChartLine,
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href="#" className="flex items-center ">
                            <Image src="/icon.png" alt="Logo" width={35} height={35} />

                            <span className="text-2xl font-semibold text-primary ml-5">TradeLab</span>
                        </a>
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
