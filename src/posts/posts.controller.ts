import { Controller, Post, Get, Put, Delete, Body, Param, Inject, HttpException, HttpStatus, UseGuards, Request, UnauthorizedException, Query } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "src/db/dto/create-post.dto";
import { SelectPostDto } from "src/db/dto/select-post.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { UpdatePostDto } from "src/db/dto/update-post.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreatePostInputDto } from "src/db/dto/create-post-input.dto";
import { skip } from "node:test";

@ApiTags('posts')
@Controller('posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'Returns the post data that has been created or an Error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    @ApiResponse({ status: 401, description: "You don't have enough permissions to perform this action." })
    @ApiBearerAuth('JWT-auth')
    async createPost(@Body() createDto: CreatePostInputDto, @Request() req): Promise<SelectPostDto> {
        const createObject = {
            ...createDto,
            author: req.user._id
        }
        try {
            const data = await this.postsService.createPost(createObject);
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

    @Get('search')
    @ApiResponse({ status: 200, description: 'Returns a list of all posts matching the search params or an Error.' })
    @ApiQuery({ name: 'title', required: false, type: String })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'content', required: false, type: String })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async searchPost(@Query('title') title?: string, @Query('category') category?: string, @Query('content') content?: string,
        @Query('skip') skip?: number, @Query('limit') limit?: number) {

        try {
            const params = {
                ...title && { title },
                ...category && { category },
                ...content && { content }
            }
            const data = await this.postsService.searchPost(params, limit ?? 10, skip ?? 0);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }

    @Get('filter')
    @ApiResponse({ status: 200, description: 'Returns a list of all posts matching the filter params or an Error.' })
    @ApiQuery({ name: 'author', required: false, type: String })
    @ApiQuery({ name: 'category', required: false, type: String })
    async filterPost(@Query('author') author?: string, @Query('category') category?: string) {
        try {
            const params = {
                ...category && { category },
                ...author && { author }
            }
            const data = await this.postsService.filterPost(params);
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
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Return status: success on correct update. If not, it returns an error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    @ApiResponse({ status: 401, description: "You don't have enough permissions to perform this action." })
    @ApiBearerAuth('JWT-auth')
    async updatePost(@Param('id') id: string, @Body() params: UpdatePostDto, @Request() req): Promise<Object> {
        if ((await this.postsService.findOne(id)).author === req.user._id || req.user.isAdmin) {
            try {
                const data = await this.postsService.updatePost(id, params);
                return data;
            } catch (e) {
                this.logger.error(e);
                //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
                throw new HttpException('Error. Try Again', HttpStatus.OK);
            }
        } else {
            throw new UnauthorizedException("You don't have enough permissions to perform this action.");
        }

    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Return status: success on correct deletion. If not, it returns an error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    @ApiResponse({ status: 401, description: "You don't have enough permissions to perform this action." })
    @ApiBearerAuth('JWT-auth')
    async deletePost(@Param('id') id: string, @Request() req): Promise<Object> {
        if ((await this.postsService.findOne(id)).author === req.user._id || req.user.isAdmin) {
            try {
                const data = await this.postsService.deletePost(id);
                return data;
            } catch (e) {
                this.logger.error(e);
                //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
                throw new HttpException('Error. Try Again', HttpStatus.OK);
            }
        } else {
            throw new UnauthorizedException("You don't have enough permissions to perform this action.");
        }
    }
}