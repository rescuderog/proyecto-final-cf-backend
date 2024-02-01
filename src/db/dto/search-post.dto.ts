import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * DTO for creating a post. We implement class validators all around, so as to validate properly the data before it's passed to the db.
 */
export class SearchPostDto {

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'Example Title', description: 'Title of the post' })
    readonly title?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'Lorem ipsum', description: 'Post content in plain text' })
    readonly content?: string

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'cooking', description: 'Category the post is tagged for' })
    readonly category?: string

}