import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

/**
 * DTO for returning a post info.
 */
export class SelectPostDto {

    @Expose()
    @Type(() => String)
    @ApiProperty({ example: '5ce819935e539c343f141fff', description: 'The ID of the post' })
    readonly _id: string

    @Expose()
    @ApiProperty({ example: 'Example Title', description: 'Title of the post' })
    readonly title: string;

    @Expose()
    @Type(() => String)
    @ApiProperty({ example: '5ce819935e539c343f141ece', description: 'UserID of the creator' })
    readonly author: string;

    @Expose()
    @ApiProperty({ example: 'Lorem ipsum', description: 'Post content in plain text' })
    readonly content: string

    @Expose()
    @ApiProperty({ example: '["cooking", "dancing"]', description: 'Array of categories the post is tagged for' })
    readonly categories: string[]

}