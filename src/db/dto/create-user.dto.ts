import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

/**
 * DTO for creating a user. We implement class validators all around, so as to validate properly the data before it's passed to the db.
 */
export class CreateUserDto {

    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;

    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsBoolean()
    readonly isAdmin?: boolean;

    @IsOptional()
    @IsNotEmpty()
    readonly name?: string;

    @IsNumber()
    readonly age: number;

}