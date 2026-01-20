import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { Throttle } from "@nestjs/throttler"

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Throttle({ default: { ttl: 3600000, limit: 3 } })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.usersService.findAll()
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.usersService.findOne(id)
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    update(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.usersService.remove(id)
    }
}
