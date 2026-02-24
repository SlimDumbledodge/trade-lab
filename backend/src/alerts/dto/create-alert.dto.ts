import { IsEnum, IsNotEmpty, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { PriceAlertConfigDto } from "./price-alert-config.dto"

/**
 * Types d'alertes supportés.
 * Dupliqué ici pour la validation DTO (class-validator ne peut pas utiliser les enums Prisma directement).
 */
export enum AlertTypeDto {
    PRICE = "PRICE",
}

/**
 * Map qui associe chaque AlertType à sa classe de config DTO.
 * Quand on ajoute un nouveau type d'alerte :
 * 1. Ajouter l'entrée dans AlertTypeDto
 * 2. Créer le DTO de config correspondant
 * 3. Ajouter l'entrée ici
 * 4. Ajouter le discriminateur dans @Type()
 */
export const ALERT_CONFIG_MAP: Record<string, new () => object> = {
    PRICE: PriceAlertConfigDto,
}

export class CreateAlertDto {
    @ApiProperty({ description: "Type d'alerte", enum: AlertTypeDto, example: AlertTypeDto.PRICE })
    @IsEnum(AlertTypeDto, { message: "Le type d'alerte doit être l'un des suivants : " + Object.values(AlertTypeDto).join(", ") })
    @IsNotEmpty({ message: "Le type d'alerte est requis" })
    type: AlertTypeDto

    @ApiProperty({
        description: "Configuration de l'alerte (dépend du type)",
        example: { symbol: "META", targetPrice: 100, direction: "BELOW" },
    })
    @ValidateNested({ message: "La configuration de l'alerte est invalide" })
    @Type((obj) => {
        // Discriminateur : transforme config en la bonne classe DTO selon le type
        const type = obj?.object?.type
        return ALERT_CONFIG_MAP[type] || PriceAlertConfigDto
    })
    @IsNotEmpty({ message: "La configuration de l'alerte est requise" })
    config: PriceAlertConfigDto // Union type, élargi quand on ajoute des types
}
