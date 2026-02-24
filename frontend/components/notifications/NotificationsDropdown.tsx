"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/hooks/useNotifications"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, BellRing, ArrowUpRight, ArrowDownRight, Inbox, CheckCheck } from "lucide-react"
import { Notification, NotificationType } from "@/types/types"
import { useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

function formatRelativeTime(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60_000)
    const diffH = Math.floor(diffMs / 3_600_000)
    const diffD = Math.floor(diffMs / 86_400_000)

    if (diffMin < 1) return "À l'instant"
    if (diffMin < 60) return `Il y a ${diffMin}min`
    if (diffH < 24) return `Il y a ${diffH}h`
    if (diffD < 7) return `Il y a ${diffD}j`
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

function NotificationIcon({ notification }: { notification: Notification }) {
    if (notification.type === NotificationType.ALERT && notification.alert) {
        const config = notification.alert.config
        const isAbove = config.direction === "ABOVE"
        return (
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isAbove ? "bg-green-500/10 ring-1 ring-green-500/20" : "bg-red-500/10 ring-1 ring-red-500/20"
                }`}
            >
                {isAbove ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
            </div>
        )
    }

    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
            <BellRing className="h-3.5 w-3.5 text-violet-500" />
        </div>
    )
}

function NotificationItem({ notification, onClick }: { notification: Notification; onClick: () => void }) {
    const isUnread = !notification.readAt

    return (
        <button
            onClick={onClick}
            className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent/50 ${
                isUnread ? "bg-accent/20" : ""
            }`}
        >
            <NotificationIcon notification={notification} />
            <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${isUnread ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                        {notification.title}
                    </p>
                    {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                <p className="text-[10px] text-muted-foreground/60">{formatRelativeTime(notification.createdAt)}</p>
            </div>
        </button>
    )
}

export function NotificationsDropdown() {
    const { data: session } = useSession()
    const { data: notifications } = useNotifications(session?.accessToken)
    const queryClient = useQueryClient()
    const router = useRouter()

    const items = notifications ?? []
    const unreadCount = useMemo(() => items.filter((n) => !n.readAt).length, [items])

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.readAt) {
            try {
                await markNotificationAsRead(notification.id, session?.accessToken)
                queryClient.invalidateQueries({ queryKey: ["notifications"] })
            } catch {
                // silent
            }
        }
        if (notification.type === NotificationType.ALERT && notification.alert) {
            router.push(`/market/${notification.alert.config.symbol}`)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead(session?.accessToken)
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            toast.success("Toutes les notifications marquées comme lues")
        } catch {
            toast.error("Erreur lors du marquage")
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg overflow-visible">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white tabular-nums ring-2 ring-background">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={8}>
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500/10 px-1.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400 tabular-nums">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10"
                                    onClick={handleMarkAllAsRead}
                                >
                                    <CheckCheck className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Tout marquer comme lu</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Notifications list */}
                <div className="max-h-[400px] overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
                                <Inbox className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Aucune notification</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Vos notifications apparaîtront ici</p>
                        </div>
                    ) : (
                        <div className="p-1.5 space-y-0.5">
                            {items.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={() => handleNotificationClick(notification)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
