import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

/**
 * DTO for updating a post. We implement optional class validators all around, as we don't
 * know what fields will come, but we also want to validate them if they are not null.
 */
export class UpdatePostDto {

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
    @IsArray()
    @ApiProperty({ example: '["cooking", "dancing"]', description: 'Array of categories the post is tagged for' })
    readonly categories?: string[]

}