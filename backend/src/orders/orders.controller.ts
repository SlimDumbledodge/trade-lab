import { Body, Controller, Param, Delete, Get, ParseIntPipe, Post, UseGuards } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"
import { CreateOrderDto } from "./dto/create-order.dto"

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get("asset/:assetId")
    findActiveByAsset(@GetUser("portfolioId") portfolioId: number, @Param("assetId", ParseIntPipe) assetId: number) {
        return this.ordersService.findActiveByAsset(portfolioId, assetId)
    }

    @Post()
    createOrder(@GetUser("portfolioId") portfolioId: number, @Body() createOrder: CreateOrderDto) {
        return this.ordersService.createOrder(portfolioId, createOrder)
    }

    @Delete(":id")
    deleteOrder(@GetUser("portfolioId") portfolioId: number, @Param("id", ParseIntPipe) orderId: number) {
        return this.ordersService.deleteOrder(portfolioId, orderId)
    }
}
