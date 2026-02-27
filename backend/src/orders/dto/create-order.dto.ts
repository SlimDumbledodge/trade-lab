import { IsEnum, IsInt, IsNotEmpty, IsNumberString, IsPositive } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { OrderType, OrderAction, OrderExpiresType } from "prisma/generated/enums"

export class CreateOrderDto {
    @ApiProperty({ description: "ID de l'asset concerné", example: 1 })
    @IsNotEmpty({ message: "L'ID de l'asset est requis" })
    @IsInt({ message: "L'ID de l'asset doit être un entier" })
    @IsPositive({ message: "L'ID de l'asset doit être positif" })
    @Type(() => Number)
    assetId: number

    @ApiProperty({ description: "Type d'ordre", enum: OrderType, example: OrderType.LIMIT })
    @IsNotEmpty({ message: "Le type d'ordre est requis" })
    @IsEnum(OrderType, {
        message: "Le type d'ordre doit être l'un des suivants : " + Object.values(OrderType).join(", "),
    })
    type: OrderType

    @ApiProperty({ description: "Action de l'ordre (achat ou vente)", enum: OrderAction, example: OrderAction.BUY })
    @IsNotEmpty({ message: "L'action de l'ordre est requise" })
    @IsEnum(OrderAction, {
        message: "L'action doit être l'une des suivantes : " + Object.values(OrderAction).join(", "),
    })
    action: OrderAction

    @ApiProperty({ description: "Durée de validité de l'ordre", enum: OrderExpiresType, example: OrderExpiresType.DAY })
    @IsNotEmpty({ message: "La durée de validité est requise" })
    @IsEnum(OrderExpiresType, {
        message: "La durée de validité doit être l'une des suivantes : " + Object.values(OrderExpiresType).join(", "),
    })
    expiresType: OrderExpiresType

    @ApiProperty({ description: "Quantité à acheter/vendre", example: "10" })
    @IsNotEmpty({ message: "La quantité est requise" })
    @IsNumberString({}, { message: "La quantité doit être un nombre décimal valide" })
    quantity: string

    @ApiProperty({ description: "Prix cible de déclenchement", example: "150.50" })
    @IsNotEmpty({ message: "Le prix cible est requis" })
    @IsNumberString({}, { message: "Le prix cible doit être un nombre décimal valide" })
    targetPrice: string
}
