import { IsEnum, IsIn, IsNumber, IsOptional, IsPositive, IsString, IsNotEmpty, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export enum AlertStatusDto {
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
}

export class UpdatePriceAlertConfigDto {
    @ApiProperty({ description: "Symbole de l'asset", required: false, example: "META" })
    @IsOptional()
    @IsString({ message: "Le symbole doit être une chaîne de caractères" })
    @IsNotEmpty({ message: "Le symbole ne peut pas être vide" })
    symbol?: string

    @ApiProperty({ description: "Prix cible", required: false, example: 100 })
    @IsOptional()
    @IsNumber({}, { message: "Le prix cible doit être un nombre" })
    @IsPositive({ message: "Le prix cible doit être positif" })
    targetPrice?: number

    @ApiProperty({ description: "Direction du déclenchement", required: false, enum: ["ABOVE", "BELOW"] })
    @IsOptional()
    @IsString({ message: "La direction doit être une chaîne de caractères" })
    @IsIn(["ABOVE", "BELOW"], { message: "La direction doit être ABOVE ou BELOW" })
    direction?: "ABOVE" | "BELOW"
}

export class UpdateAlertDto {
    @ApiProperty({ description: "Nouveau statut de l'alerte", enum: AlertStatusDto, required: false })
    @IsOptional()
    @IsEnum(AlertStatusDto, { message: "Le statut doit être ACTIVE ou DISABLED" })
    status?: AlertStatusDto

    @ApiProperty({ description: "Configuration mise à jour", required: false })
    @IsOptional()
    @ValidateNested({ message: "La configuration de l'alerte est invalide" })
    @Type(() => UpdatePriceAlertConfigDto)
    config?: UpdatePriceAlertConfigDto
}
