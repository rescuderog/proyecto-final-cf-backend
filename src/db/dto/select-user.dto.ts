import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * DTO for returning a user info.
 */
export class SelectUserDto {

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
    @ApiProperty({ example: 'exampleid', description: 'User ID in the DB' })
    readonly _id: string;

}