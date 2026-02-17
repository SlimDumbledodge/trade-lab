import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class UpdateProfileDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
    @MaxLength(20, { message: "Le nom d'utilisateur ne doit pas dépasser 20 caractères" })
    username?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail({}, { message: "Email invalide" })
    email?: string
}
