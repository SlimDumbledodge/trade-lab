import { IsInt, IsPositive } from 'class-validator';

export class BuyActifDto {
    @IsInt()
    @IsPositive()
    actifId: number;

    @IsInt()
    @IsPositive()
    quantity: number;
}
