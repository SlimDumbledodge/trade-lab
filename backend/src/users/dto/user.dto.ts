import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    username: string

    @ApiProperty()
    email: string

    @ApiProperty()
    portfolioId: number | null
}
