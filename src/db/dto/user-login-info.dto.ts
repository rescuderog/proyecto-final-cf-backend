import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

/**
 * DTO for returning a user login info (saved in a JWT Token).
 */
export class UserLoginInfoDto {

    @Expose()
    @ApiProperty({ example: 'user1', description: 'User name' })
    readonly username: string;

    @Expose()
    @ApiProperty({ example: 'email@test.com', description: 'User email' })
    readonly email: string;

    @Expose()
    @ApiProperty({ example: '20', description: 'User age' })
    readonly age: number;

    @Expose()
    @Type(() => String)
    @ApiProperty({ example: 'exampleid', description: 'User ID in the DB' })
    readonly _id: string;

    @Expose()
    @Type(() => Boolean)
    @ApiProperty({ example: 'true/false', description: 'User has admin privileges or not' })
    readonly isAdmin: string;
}