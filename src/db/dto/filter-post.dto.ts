import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * DTO for creating a post. We implement class validators all around, so as to validate properly the data before it's passed to the db.
 */
export class FilterPostDto {

    @IsOptional()
    @IsNotEmpty()
    @Type(() => String)
    @ApiProperty({ example: '5ce819935e539c343f141ece', description: 'UserID of the creator' })
    readonly author?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'cooking', description: 'Category the post is tagged for' })
    readonly category?: string

}