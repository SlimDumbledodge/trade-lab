'use client';

import * as React from 'react';
import {
    IconCamera,
    IconChartBar,
    IconChartHistogram,
    IconChartLine,
    IconFileAi,
    IconFileDescription,
    IconFolder,
    IconInnerShadowTop,
    IconListDetails,
    IconSettings,
    IconUsers,
    IconWallet,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { Separator } from './ui/separator';

const data = {
    user: {
        name: 'Amaël Rosales',
        email: 'amael.rosales@gmail.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Portefeuille',
            url: '#',
            icon: IconWallet,
        },
        {
            title: 'Transactions',
            url: '#',
            icon: IconChartBar,
        },
        {
            title: 'Marché',
            url: '#',
            icon: IconChartLine,
        },
        {
            title: 'Statistiques',
            url: '#',
            icon: IconChartHistogram,
        },
        {
            title: 'Paramètres',
            url: '#',
            icon: IconSettings,
        },
    ],
    navClouds: [
        {
            title: 'Capture',
            icon: IconCamera,
            isActive: true,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Proposal',
            icon: IconFileDescription,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Prompts',
            icon: IconFileAi,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
    ],
};

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
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
