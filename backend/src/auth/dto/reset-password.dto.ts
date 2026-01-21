import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "token-recu-par-email" })
    token: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({ example: "newPassword123", minLength: 6 })
    newPassword: string
}
