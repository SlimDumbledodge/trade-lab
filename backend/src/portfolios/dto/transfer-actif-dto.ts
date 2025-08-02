import { IsInt, IsPositive } from 'class-validator';

export class TransferActifDto {
    @IsInt()
    @IsPositive()
    actifId: number;

    @IsInt()
    @IsPositive()
    quantity: number;
}
