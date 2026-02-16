import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { Throttle } from "@nestjs/throttler"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { v4 as uuidv4 } from "uuid"
import * as path from "node:path"
import { GetUser } from "src/common/decorators/user.decorator"

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

    @Patch("complete-onboarding")
    @UseGuards(JwtAuthGuard)
    completeOnboarding(@GetUser("id") userId: number) {
        return this.usersService.completeOnboarding(userId)
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

    @Throttle({ default: { ttl: 3600000, limit: 5 } })
    @Post("upload-avatar")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "./uploads/avatars",
                filename: (req, file, cb) => {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4()
                    const extension: string = path.parse(file.originalname).ext
                    cb(null, `${filename}${extension}`)
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
                    return cb(new Error("Seuls les fichiers image (jpeg, png, gif, webp) sont autorisés"), false)
                }
                cb(null, true)
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5 Mo
            },
        }),
    )
    async uploadAvatar(
        @GetUser("id") userId: number,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
            }),
        )
        file: Express.Multer.File,
    ) {
        const normalizedPath = file.path.replace(/\\/g, "/")
        return this.usersService.updateAvatarPath(userId, normalizedPath)
    }
}
