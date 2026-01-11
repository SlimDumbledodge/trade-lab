import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { Prisma, Transaction, TransactionType } from "prisma/generated/client"
import { PortfoliosAssetsService } from "src/portfolios-assets/portfolios-assets.service"
import { PortfoliosSnapshotsService } from "src/portfolios-snapshots/portfolios-snapshots.service"
import { AssetOperationDto } from "src/portfolios/dto/asset-operation-dto"
import { PortfoliosService } from "src/portfolios/portfolios.service"
import { PrismaService } from "src/prisma/prisma.service"
import { TransactionPublic } from "src/types/public.types"

@Injectable()
export class TransactionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly portfoliosService: PortfoliosService,
        private readonly portfoliosAssetsService: PortfoliosAssetsService,
        private readonly portfoliosSnapshotsService: PortfoliosSnapshotsService,
    ) {}

    async getTransactions(portfolioId: number, page: number = 1, limit: number = 10) {
        const nbTransactionsToSkip = (page - 1) * limit

        const [items, total] = await this.prisma.$transaction([
            this.prisma.transaction.findMany({
                where: { portfolioId: portfolioId },
                include: { asset: true },
                orderBy: { createdAt: "desc" },
                skip: nbTransactionsToSkip,
                take: limit,
            }),

            this.prisma.transaction.count({ where: { portfolioId } }),
        ])

        return {
            data: {
                items,
                meta: {
                    total,
                    page,
                    lastPage: Math.ceil(total / limit),
                },
            },
        }
    }

    async buyAsset(portfolioId: number, buyAssetDto: AssetOperationDto) {
        const { assetId, quantity } = buyAssetDto
        const asset = await this.prisma.asset.findUnique({ where: { id: assetId } })
        if (!asset) throw new BadRequestException(`L'asset avec l'ID ${assetId} n'existe pas`)

        const totalCost = asset.lastPrice.mul(quantity)

        await this.portfoliosService.checkSufficientFunds(portfolioId, totalCost)
        await this.portfoliosAssetsService.createPortfolioAsset(portfolioId, assetId, new Prisma.Decimal(quantity), asset.lastPrice)
        await this.portfoliosService.updatePortfolioCashBalance(portfolioId, totalCost, TransactionType.buy)
        await this.portfoliosService.calculatePortfolioAssetsValue(portfolioId)
        await this.portfoliosSnapshotsService.capturePortfolioSnapshot(portfolioId)

        const transaction: TransactionPublic = {
            portfolioId,
            assetId: asset.id,
            price: asset.lastPrice,
            quantity: new Prisma.Decimal(quantity),
            type: TransactionType.buy,
        }
        return this.createTransaction(transaction)
    }
    async sellAsset(portfolioId: number, sellAssetDto: AssetOperationDto) {
        const { assetId, quantity } = sellAssetDto
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: {
                portfolioAssets: true,
            },
        })

        if (!portfolio) {
            throw new NotFoundException(`Portfolio ID ${portfolioId} not found`)
        }
        const asset = await this.prisma.asset.findUnique({ where: { id: assetId } })
        if (!asset) throw new BadRequestException(`L'asset avec l'ID ${assetId} n'existe pas`)

        const portfolioAsset = portfolio.portfolioAssets.find((asset) => asset.assetId === assetId)

        if (!portfolioAsset) {
            throw new NotFoundException(`You can't sell an asset you do not own`)
        }

        if (quantity > Number(portfolioAsset.quantity)) {
            throw new BadRequestException(`You can't sell more than you own`)
        }
        if (quantity === Number(portfolioAsset.quantity)) {
            await this.prisma.portfolioAsset.delete({
                where: {
                    id: portfolioAsset.id,
                },
            })
        } else {
            await this.prisma.portfolioAsset.update({
                where: {
                    id: portfolioAsset.id,
                },
                data: {
                    quantity: Number(portfolioAsset.quantity) - quantity,
                },
            })
        }
        const transaction: TransactionPublic = {
            portfolioId,
            assetId: asset.id,
            price: asset.lastPrice,
            quantity: new Prisma.Decimal(quantity),
            type: TransactionType.sell,
        }
        await this.portfoliosService.updatePortfolioCashBalance(portfolioId, asset.lastPrice.mul(quantity), TransactionType.buy)
        await this.portfoliosService.calculatePortfolioAssetsValue(portfolioId)
        await this.portfoliosSnapshotsService.capturePortfolioSnapshot(portfolioId)
        return this.createTransaction(transaction)
    }

    createTransaction(transaction: TransactionPublic) {
        return this.prisma.transaction.create({
            data: transaction,
        })
    }
}
