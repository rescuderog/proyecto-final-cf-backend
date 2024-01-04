import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

/**
 * DTO for creating a user. We implement class validators all around, so as to validate properly the data before it's passed to the db.
 */
export class CreateUserDto {

    @IsNotEmpty()
    @ApiProperty({ example: 'user1', description: 'Username' })
    readonly username: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'password', description: 'User Password' })
    readonly password: string;

    @IsEmail()
    @ApiProperty({ example: 'email@test.com', description: 'User email (must conform to the usual x@y.z)' })
    readonly email: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'Leroy Jenkins', description: 'Name and surname. Optional value.' })
    readonly name?: string;

    @IsNumber()
    @ApiProperty({ example: '18', description: 'Age' })
    readonly age: number;

}