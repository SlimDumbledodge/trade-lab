"use client"

import { IconDotsVertical, IconLogout, IconUserCircle } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

function getInitials(name?: string | null) {
    if (!name) return "?"
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function NavUser() {
    const { data: session } = useSession()
    const { isMobile } = useSidebar()

    if (!session?.user) return null

    const avatarUrl = session.user.avatarPath
        ? `${process.env.NEXT_PUBLIC_NEST_API_URL}/${session.user.avatarPath.replace(/^\/?uploads/, "uploads")}`
        : null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" className="object-cover" />}
                                <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-600 to-purple-400 text-xs font-bold text-white">
                                    {getInitials(session.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{session.user.name}</span>
                                <span className="text-muted-foreground truncate text-xs">{session.user.email}</span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8">
                                    {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" className="object-cover" />}
                                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-400 text-xs font-bold text-white">
                                        {getInitials(session.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{session.user.name}</span>
                                    <span className="text-muted-foreground truncate text-xs">{session.user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/account">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer">
                                    <IconUserCircle />
                                    Mon compte
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                                signOut({ callbackUrl: "/login" })
                            }}
                        >
                            <IconLogout />
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
