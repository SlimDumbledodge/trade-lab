"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table"
import moment from "moment"
import { Transaction, TransactionType } from "@/types/types"

interface TransactionSheetProps {
    transaction: Transaction | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TransactionSheet({ transaction, open, onOpenChange }: TransactionSheetProps) {
    if (!transaction) return null

    const total = Number(transaction.price * transaction.quantity).toFixed(2)

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent position="right" size="default">
                <SheetHeader className="mt-8">
                    <SheetTitle>
                        {transaction.type === TransactionType.BUY ? `Vous avez investi ${total}€` : `Vous avez reçu ${total}€`}
                    </SheetTitle>
                    <SheetDescription>Le {moment(transaction.createdAt).format("DD MMMM YYYY [à] HH:mm:ss")}</SheetDescription>
                    <Separator className="mt-4" />
                </SheetHeader>

                <div className="gap-4 py-4">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Actif</TableCell>
                                <TableCell className="text-right font-semibold">{transaction.asset.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Transaction</TableCell>
                                <TableCell className="text-right font-semibold">
                                    {Number(transaction.quantity).toFixed(6)} x {transaction.price} €
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Total</TableCell>
                                <TableCell className="text-right font-semibold">{total} €</TableCell>
                            </TableRow>
                            {/* Tu pourras ajouter d’autres types ici */}
                        </TableBody>
                    </Table>
                </div>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
