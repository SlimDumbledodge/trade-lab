import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { TransactionsService } from "./transactions.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"
import { AssetOperationDto } from "src/portfolios/dto/asset-operation-dto"
import { Throttle } from "@nestjs/throttler"

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get()
    getTransactions(@GetUser("portfolioId") portfolioId: number, @Query("page") page: string = "1", @Query("limit") limit: string = "10") {
        return this.transactionsService.getTransactions(portfolioId, Number(page), Number(limit))
    }

    @Throttle({ default: { ttl: 60000, limit: 20 } })
    @Post("buy")
    buyAsset(@GetUser("portfolioId") portfolioId: number, @Body() buyAssetDto: AssetOperationDto) {
        return this.transactionsService.buyAsset(portfolioId, buyAssetDto)
    }

    @Throttle({ default: { ttl: 60000, limit: 20 } })
    @Post("sell")
    sellAsset(@GetUser("portfolioId") portfolioId: number, @Body() sellAssetDto: AssetOperationDto) {
        return this.transactionsService.sellAsset(portfolioId, sellAssetDto)
    }
}
