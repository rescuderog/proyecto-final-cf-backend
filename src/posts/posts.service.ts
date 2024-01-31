import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { CreatePostDto } from "src/db/dto/create-post.dto";
import { SelectPostDto } from "src/db/dto/select-post-dto";
import { UpdatePostDto } from "src/db/dto/update-post.dto";
import { Post } from "src/db/schemas/post.schema";
import { plainToClass } from "class-transformer";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PostsService {

    constructor(
        @InjectModel(Post.name) private readonly postModel: Model<Post>,
        private readonly usersService: UsersService
    ) { }

    /**
      * Creates the post using the model defined in the DTO. Returns the success information of the query if the post is created.
      * @param data CreatePostDto    The data used to create the user
      * @returns Promise<SelectPostDto>
      */
    async createPost(data: CreatePostDto): Promise<SelectPostDto> {
        //we check if there is an user with this ID. We let the UsersService manage the exceptions.
        if (await this.usersService.findOne(data.author)) {
            const result = await this.postModel.create(data);
            return plainToClass(SelectPostDto, result.toJSON(), { excludeExtraneousValues: true });
        } else {
            //in the hypotethical case we get empty data, we manage the exception. This should NOT happen at any time, though.
            throw new HttpException('An error happened and was not handled by the users service.', 418);
        }
    }

    /**
     * Returns every post data as defined in the DTO.
     * @returns Promise<SelectPostDto[]>
     */
    async findAll(): Promise<SelectPostDto[]> {
        const users = await this.postModel.find({}, {}).lean();
        return users.map(
            user => {
                return plainToClass(SelectPostDto, user, { excludeExtraneousValues: true })
            });
    }

    /**
     * Returns every post data as defined in the DTO from a specific user.
     * @returns Promise<SelectPostDto[]>
     */
    async findAllFromUser(userid: string): Promise<SelectPostDto[]> {
        const users = await this.postModel.find({ author: userid }, {}).lean();
        return users.map(
            user => {
                return plainToClass(SelectPostDto, user, { excludeExtraneousValues: true })
            });
    }

    /**
     * Returns one post's data as defined in the DTO.
     * @param id string The id of the user.
     * @returns Promise<SelectPostDto>
     */
    async findOne(id: string): Promise<SelectPostDto> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('The ID inputted: ' + id + ' is not valid.');
        }

        const user = await this.postModel.findById(id);

        if (!user) {
            throw new NotFoundException('There is no post with an ID of ' + id);
        }

        return plainToClass(SelectPostDto, user.toJSON(), { excludeExtraneousValues: true });
    }

    /**
     * Attempts to update the post with the id parameter. Returns the success information of the query if the user is updated.
     * @param id string    The id of the post
     * @param params UpdatePostDto    The data used to update the post
     * @returns Promise<Object>
     */
    async updatePost(id: string, params: UpdatePostDto): Promise<Object> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('The ID inputted: ' + id + ' is not valid.');
        }

        const result = await this.postModel.updateOne({ _id: id }, params).lean();

        if (result.matchedCount === 1) {
            if (result.modifiedCount === 1) {
                return {
                    status: 'Success'
                };
            }
            else {
                return {
                    status: 'Nothing was modified'
                };
            }
        } else {
            throw new NotFoundException('There is no user with an ID of ' + id);
        }
    }

    /**
     * Attempts to delete the user with the id parameter. Returns the success information of the query if the user is deleted.
     * @param id string    The id of the user
     * @returns Promise<Object> 
     */
    async deletePost(id: string): Promise<Object> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('The ID inputted: ' + id + ' is not valid.');
        }

        const result = await this.postModel.deleteOne({ _id: id }).lean();

        if (result.deletedCount === 1) {
            return {
                status: 'Success'
            };
        } else {
            throw new NotFoundException('There is no user with an ID of ' + id);
        }
    }

}