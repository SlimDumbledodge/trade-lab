import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common"
import { FavoritesService } from "./favorites.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"

@Controller("favorites")
@UseGuards(JwtAuthGuard)
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get()
    findAll(@GetUser("id") userId: number) {
        return this.favoritesService.findAll(userId)
    }

    @Post()
    add(@GetUser("id") userId: number, @Body("assetId") assetId: number) {
        return this.favoritesService.add(userId, assetId)
    }

    @Delete()
    remove(@GetUser("id") userId: number, @Body("assetId") assetId: number) {
        return this.favoritesService.remove(userId, assetId)
    }
}
