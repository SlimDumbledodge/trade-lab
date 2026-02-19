import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class FavoritesService {
    private readonly logger = new Logger(FavoritesService.name)

    constructor(private prisma: PrismaService) {}

    async findAll(userId: number) {
        return this.prisma.favorite.findMany({
            where: { userId },
            include: { asset: true },
        })
    }

    async add(userId: number, assetId: number) {
        return this.prisma.favorite.upsert({
            where: { userId_assetId: { userId, assetId } },
            create: { userId, assetId },
            update: {},
        })
    }

    async remove(userId: number, assetId: number) {
        return this.prisma.favorite.deleteMany({
            where: { userId, assetId },
        })
    }
}
