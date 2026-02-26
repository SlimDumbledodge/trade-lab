import { IsEnum, IsInt, IsNotEmpty, IsPositive, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

export enum FrequencyTypeDto {
    WEEKLY = "WEEKLY",
    TWICE_BY_MONTH = "TWICE_BY_MONTH",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
}

export enum FirstExecutionTypeDto {
    MONTH_START = "MONTH_START",
    MID_MONTH = "MID_MONTH",
}

export class CreateInvestmentPlanDto {
    @ApiProperty({ description: "ID de l'actif concerné", example: 1 })
    @IsNotEmpty({ message: "L'ID de l'actif est requis" })
    @IsInt({ message: "L'ID de l'actif doit être un entier" })
    @IsPositive({ message: "L'ID de l'actif doit être positif" })
    @Type(() => Number)
    assetId: number

    @ApiProperty({
        description: "Fréquence d'exécution du plan",
        enum: FrequencyTypeDto,
        example: FrequencyTypeDto.MONTHLY,
    })
    @IsNotEmpty({ message: "La fréquence est requise" })
    @IsEnum(FrequencyTypeDto, {
        message: "La fréquence doit être l'une des suivantes : " + Object.values(FrequencyTypeDto).join(", "),
    })
    frequency: FrequencyTypeDto

    @ApiProperty({
        description: "Moment de la première exécution",
        enum: FirstExecutionTypeDto,
        example: FirstExecutionTypeDto.MONTH_START,
    })
    @IsNotEmpty({ message: "Le moment de la première exécution est requis" })
    @IsEnum(FirstExecutionTypeDto, {
        message: "Le moment de la première exécution doit être l'un des suivants : " + Object.values(FirstExecutionTypeDto).join(", "),
    })
    firstExecution: FirstExecutionTypeDto

    @ApiProperty({ description: "Montant à investir à chaque exécution", example: 100 })
    @IsNotEmpty({ message: "Le montant est requis" })
    @Type(() => Number)
    @IsPositive({ message: "Le montant doit être positif" })
    @Min(1, { message: "Le montant minimum est de 1" })
    amount: number
}
