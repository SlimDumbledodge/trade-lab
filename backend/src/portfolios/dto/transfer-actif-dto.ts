import { IsInt, IsPositive } from 'class-validator';

export class TransferActifDto {
    @IsInt()
    @IsPositive()
    assetId: string;

    @IsInt()
    @IsPositive()
    quantity: number;
}
