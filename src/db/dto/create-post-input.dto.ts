import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty } from "class-validator";

/**
 * DTO for receiving user input to create a post. We implement class validators all around, so as to validate properly the data before it's passed to the db.
 */
export class CreatePostInputDto {

    @IsNotEmpty()
    @ApiProperty({ example: 'Example Title', description: 'Title of the post' })
    readonly title: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'Lorem ipsum', description: 'Post content in plain text' })
    readonly content: string

    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ example: '["cooking", "dancing"]', description: 'Array of categories the post is tagged for' })
    readonly categories: string[]

}