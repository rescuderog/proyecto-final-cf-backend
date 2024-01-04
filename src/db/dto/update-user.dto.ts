import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

/**
 * DTO for updating a user info. We implement optional class validators all around, as we don't
 * know what fields will come, but we also want to validate them if they are not null.
 */
export class UpdateUserDto {

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'password', description: 'User Password' })
    readonly password?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ example: 'email@test.com', description: 'User email (must conform to the usual x@y.z)' })
    readonly email?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'Leroy Jenkins', description: 'Name and surname. Optional value.' })
    readonly name?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: '18', description: 'Age' })
    readonly age?: number;
}