import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { PrismaService } from "src/prisma/prisma.service"
import * as bcrypt from "bcrypt"
import { roundsOfHashing } from "src/utils/constant"

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, roundsOfHashing)
        createUserDto.password = hashedPassword
        return this.prisma.user.create({
            data: {
                username: createUserDto.username,
                email: createUserDto.email,
                passwordHash: createUserDto.password,
                portfolio: {
                    create: {},
                },
            },
            include: {
                portfolio: {
                    include: {
                        portfolioAssets: true,
                    },
                },
            },
        })
    }

    findAll() {
        return this.prisma.user.findMany()
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                portfolio: {
                    include: {
                        portfolioAssets: true,
                    },
                },
            },
        })

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found !`)
        }
        return user
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, roundsOfHashing)
        }
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        })
    }

    remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        })
    }
}
