import { Controller, Post, Get, Put, Delete, Body, Param, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "src/db/dto/create-post.dto";
import { SelectPostDto } from "src/db/dto/select-post-dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { UpdatePostDto } from "src/db/dto/update-post.dto";

@ApiTags('posts')
@Controller('posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) { }

    @Post()
    @ApiResponse({ status: 201, description: 'Returns the post data that has been created or an Error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    async createPost(@Body() createDto: CreatePostDto): Promise<SelectPostDto> {
        try {
            const data = await this.postsService.createPost(createDto);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 201 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.CREATED);
        }
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of all posts or an Error.' })
    async getAllPosts(): Promise<SelectPostDto[]> {
        try {
            const data = await this.postsService.findAll();
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }

    @Get('/user/:id')
    @ApiResponse({ status: 200, description: 'Returns a list of all posts from a User or an Error.' })
    async getAllPostsFromUser(@Param('id') id: string): Promise<SelectPostDto[]> {
        try {
            const data = await this.postsService.findAllFromUser(id);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Returns an specific post if it matches the id in the DB or an Error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    async getSpecificPost(@Param('id') id: string): Promise<SelectPostDto> {
        try {
            const data = await this.postsService.findOne(id);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }

    @Put(':id')
    @ApiResponse({ status: 201, description: 'Return status: success on correct update. If not, it returns an error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    async updatePost(@Param('id') id: string, @Body() params: UpdatePostDto): Promise<Object> {
        try {
            const data = await this.postsService.updatePost(id, params);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Return status: success on correct deletion. If not, it returns an error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    async deletePost(@Param('id') id: string): Promise<Object> {
        try {
            const data = await this.postsService.deletePost(id);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }
}