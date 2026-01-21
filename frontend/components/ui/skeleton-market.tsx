import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SkeletonMarket() {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-8 w-56" />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Titre</TableHead>
                        <TableHead className="font-bold text-center">Prix moyen</TableHead>
                        <TableHead className="font-bold text-center">Bid</TableHead>
                        <TableHead className="font-bold text-center">Ask</TableHead>
                        <TableHead className="font-bold text-center">Horodatage</TableHead>
                        <TableHead className="font-bold text-center">Actions</TableHead>
                        <TableHead className="font-bold text-center">Aujourd'hui</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(10)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-7 h-7 rounded-xl" />
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-5 w-20 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-5 w-20 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-5 w-20 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-5 w-24 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-5 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-5 w-16 mx-auto" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
