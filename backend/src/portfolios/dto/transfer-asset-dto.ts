import { IsString, IsPositive } from 'class-validator';

export class TransferAssetDto {
    @IsString()
    assetId: string;

    @IsPositive()
    quantity: number;
}
