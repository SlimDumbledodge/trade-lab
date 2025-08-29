import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class AuthEntity {
    @ApiProperty()
    accessToken: string;

    @ApiProperty({ type: UserDto })
    user: UserDto;
}
