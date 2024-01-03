import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

/**
 * DTO for updating a user info. We implement optional class validators all around, as we don't
 * know what fields will come, but we also want to validate them if they are not null.
 */
export class UpdateUserDto {

    @IsOptional()
    @IsNotEmpty()
    readonly password?: string;

    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @IsOptional()
    @IsBoolean()
    readonly isAdmin?: boolean;

    @IsOptional()
    @IsNotEmpty()
    readonly name?: string;

    @IsOptional()
    @IsNumber()
    readonly age?: number;
}