import { IsPositive, IsNumber } from "class-validator"

export class AssetOperationDto {
    @IsNumber()
    assetId: number

    @IsPositive()
    quantity: number
}
