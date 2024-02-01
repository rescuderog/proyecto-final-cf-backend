import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

/**
 * DTO for checking the user sent info on a login.
 */
export class UserLoginDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'user1', description: 'Username' })
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'password', description: 'User Password' })
    readonly password: string;

}