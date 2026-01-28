"use client"

import { useState } from "react"
import { HomeLayout } from "@/components/layouts/HomeLayout"
import { useSession } from "next-auth/react"
import { PaginatedTransactions, Transaction, TransactionType } from "@/types/types"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { Search } from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import moment from "moment"
import "moment/locale/fr"
import { TransactionSheet } from "@/components/transactions/TransactionSheet"
import { useTransactions } from "@/hooks/useTransactions"
import { SkeletonTransactions } from "@/components/ui/skeleton-transactions"

moment.locale("fr")

function getPaginationPages(current: number, total: number, delta: number = 2) {
    const pages: (number | "ellipsis")[] = []
    const range = []

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i)
    }

    pages.push(1) // toujours la première page

    if (range[0] > 2) {
        pages.push("ellipsis") // espace avant la plage
    }

    for (const i of range) {
        pages.push(i)
    }

    if (range[range.length - 1] < total - 1) {
        pages.push("ellipsis") // espace après la plage
    }

    if (total > 1) pages.push(total) // toujours la dernière page

    return pages
}

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 8

    const { data: session } = useSession()
    const { data: transactions, isLoading, error } = useTransactions(currentPage, limit, session?.accessToken)

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    if (isLoading)
        return (
            <HomeLayout headerTitle="Transactions">
                <SkeletonTransactions />
            </HomeLayout>
        )
    if (error) return <p className="p-6 text-red-600">Erreur : {error.message}</p>

    const hasTransactions = transactions && transactions.items.length > 0
    const totalPages = transactions?.meta.lastPage || 1
    const pages = getPaginationPages(currentPage, totalPages, 2)

    return (
        <HomeLayout headerTitle="Transactions">
            {!hasTransactions ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <EmptyState
                        title="Aucune transaction !"
                        description="Vous les verrez apparaître lorsque vous ferez un achat ou une vente d’un ordre."
                        icons={[Search]}
                    />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">Transactions</h2>
                        <Table>
                            <TableCaption>Liste complète de vos transactions.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Informations</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.items.map((transaction) => (
                                    <TableRow
                                        key={transaction.id}
                                        className="cursor-pointer hover:bg-muted/50 transition"
                                        onClick={() => {
                                            setSelectedTransaction(transaction)
                                            setIsSheetOpen(true)
                                        }}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    className="rounded-xl shadow"
                                                    src={transaction.asset.logo}
                                                    alt={transaction.asset.symbol}
                                                    width={40}
                                                    height={40}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{transaction.asset.name}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        <span className="hidden sm:inline">
                                                            {moment(transaction.createdAt).format("DD MMMM YYYY [à] HH:mm:ss")}{" "}
                                                            -{" "}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            {moment(transaction.createdAt).format("DD/MM/YY")} -{" "}
                                                        </span>
                                                        {transaction.type === TransactionType.BUY
                                                            ? "Ordre d'achat"
                                                            : "Ordre de vente"}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {(transaction.quantity * transaction.price).toFixed(2)} €
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TransactionSheet transaction={selectedTransaction} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
                    </div>
                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                                        }}
                                    />
                                </PaginationItem>

                                {pages.map((page, idx) =>
                                    page === "ellipsis" ? (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === currentPage}
                                                className="rounded-full"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setCurrentPage(page)
                                                }}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ),
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </HomeLayout>
    )
}

export default Page
