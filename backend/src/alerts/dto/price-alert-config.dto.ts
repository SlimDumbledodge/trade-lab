import { IsIn, IsNumber, IsPositive, IsString, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { PriceAlertConfig } from "../interfaces/price-alert-config.interface"

export class PriceAlertConfigDto implements PriceAlertConfig {
    @ApiProperty({ description: "Symbole de l'asset (ex: META, AAPL)", example: "META" })
    @IsString({ message: "Le symbole doit être une chaîne de caractères" })
    @IsNotEmpty({ message: "Le symbole est requis" })
    symbol: string

    @ApiProperty({ description: "Prix cible", example: 100 })
    @IsNumber({}, { message: "Le prix cible doit être un nombre" })
    @IsPositive({ message: "Le prix cible doit être positif" })
    targetPrice: number

    @ApiProperty({ description: "Direction du déclenchement", enum: ["ABOVE", "BELOW"], example: "BELOW" })
    @IsString({ message: "La direction doit être une chaîne de caractères" })
    @IsIn(["ABOVE", "BELOW"], { message: "La direction doit être ABOVE ou BELOW" })
    direction: "ABOVE" | "BELOW"
}
