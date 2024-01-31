import { Test, TestingModule } from "@nestjs/testing"
import { User, UserSchema } from "src/db/schemas/user.schema"
import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { UsersService } from "src/users/users.service"
import { Model } from "mongoose"
import { mockCreateUserData, mockResultUser } from "../mocks/users.stub"
import * as ct from 'class-transformer'
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { closeInMongodConnection, rootMongooseTestModule } from "test/utils/MongooseTestModule"
import { SelectUserDto } from "src/db/dto/select-user.dto"
import { PostsService } from "src/posts/posts.service"
import { Post, PostSchema } from "src/db/schemas/post.schema"
import { CreatePostDto } from "src/db/dto/create-post.dto"
import { mockCreatePostData } from "../mocks/posts.stub"
import { SelectPostDto } from "src/db/dto/select-post-dto"
import { generateRandomText } from "test/utils/generateRandomText"

describe('PostsService', () => {

    let usersService: UsersService
    let postsService: PostsService
    let userModel: Model<User>;
    let postModel: Model<Post>;
    let mockResultPostWithId: SelectPostDto;
    let mockPostData: CreatePostDto;

    const ctSpy = jest.spyOn(ct, 'plainToClass');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{
                    name: User.name, schema: UserSchema
                }, {
                    name: Post.name, schema: PostSchema
                }])
            ],
            providers: [
                UsersService,
                PostsService
            ]
        }).compile();


        usersService = module.get<UsersService>(UsersService);
        postsService = module.get<PostsService>(PostsService);
        userModel = module.get<Model<User>>(getModelToken(User.name));
        postModel = module.get<Model<Post>>(getModelToken(Post.name));

        const createdUser = await usersService.createUser(mockCreateUserData);
        mockPostData = { author: createdUser._id, ...mockCreatePostData };
        ctSpy.mockClear();
    })

    describe('createPost', () => {
        it('should create a post and return an object with some data of the created post', async () => {
            jest.spyOn(postModel, 'create');

            const result = await postsService.createPost(mockPostData);

            expect(postModel.create).toHaveBeenCalledWith(mockPostData);
            expect(ct.plainToClass).toHaveBeenCalled();

            mockResultPostWithId = { _id: result._id, ...mockPostData };
            expect(result).toEqual(mockResultPostWithId);
        });
    });

    describe('findOne', () => {
        it('should throw a BadRequestException if the ID is not a valid ID', async () => {
            jest.spyOn(postModel, 'findById');

            await expect(postsService.findOne('test123')).rejects.toThrow(BadRequestException);
            expect(postModel.findById).not.toHaveBeenCalled();
        });

        it('should throw a NotFoundException if the Post is not found', async () => {
            await expect(postsService.findOne('5ce819935e539c343f141ece')).rejects.toThrow(NotFoundException);
            expect(ct.plainToClass).not.toHaveBeenCalled();
        });

        it('should find and return a Post by ID', async () => {
            const createdPost = await postsService.createPost(mockPostData);
            mockResultPostWithId = { _id: createdPost._id, ...mockPostData };

            const result = await postsService.findOne(createdPost._id);

            expect(ct.plainToClass).toHaveBeenCalled();
            expect(result).toEqual(mockResultPostWithId);
        });
    });

    describe('findAllFromUser', () => {
        beforeEach(async () => {
            const createdPost = await postsService.createPost(mockPostData);
            mockResultPostWithId = { _id: createdPost._id, ...mockPostData };
        })

        it('should return an array of results on a user that has posts', async () => {
            const result = await postsService.findAllFromUser(mockResultPostWithId.author);

            expect(result).toEqual([mockResultPostWithId]);
        });

        it('should return an empty array on a user that has no posts or doesnt exists', async () => {
            const result = await postsService.findAllFromUser('5ce819935e539c343f141ece');

            expect(result).toEqual([]);
        });

        it('should return a BadRequestException if the ID is not a valid ID', async () => {
            await expect(postsService.findAllFromUser('test123')).rejects.toThrow(BadRequestException);
        })
    })

    describe('findAll', () => {
        it('should return an array of results', async () => {
            const createdPost = await postsService.createPost(mockPostData);
            mockResultPostWithId = { _id: createdPost._id, ...mockPostData };

            const result = await postsService.findAll();

            expect(result).toEqual([mockResultPostWithId]);
        });
    });

    describe('updateUser', () => {
        beforeEach(async () => {
            const createdPost = await postsService.createPost(mockPostData);
            mockResultPostWithId = { _id: createdPost._id, ...mockPostData };
        })

        it('should return success and update the specified user data', async () => {
            const dataToUpdate = {
                title: generateRandomText(15)
            };

            const result = await postsService.updatePost(mockResultPostWithId._id, dataToUpdate);
            expect(result).toEqual({
                status: 'Success'
            });
        });

        it('should throw a NotFoundException if a valid but inexistent ID is inputted', async () => {
            const dataToUpdate = {
                title: generateRandomText(15)
            };

            await expect(postsService.updatePost('5ce819935e539c343f141ece', dataToUpdate)).rejects.toThrow(NotFoundException);
        });

        it('should throw a BadRequestException if the ID is not a valid ID', async () => {
            const dataToUpdate = {
                title: generateRandomText(15)
            };

            await expect(postsService.updatePost('test123', dataToUpdate)).rejects.toThrow(BadRequestException);
        })
    });

    describe('deleteUser', () => {
        beforeEach(async () => {
            const createdPost = await postsService.createPost(mockPostData);
            mockResultPostWithId = { _id: createdPost._id, ...mockPostData };
        })

        it('should return the filtered deleted user data and delete the user with the specified ID', async () => {
            const result = await postsService.deletePost(mockResultPostWithId._id);

            expect(result).toEqual({
                status: 'Success'
            });
        });

        it('should throw a NotFoundException if a valid but inexistent ID is inputted', async () => {
            await expect(postsService.deletePost('5ce819935e539c343f141ece')).rejects.toThrow(NotFoundException);
        });

        it('should throw a BadRequestException if the ID is not a valid ID', async () => {
            await expect(postsService.deletePost('test123')).rejects.toThrow(BadRequestException);
        })
    });

    afterAll(async () => {
        jest.setTimeout(20000)
        await closeInMongodConnection();
    });
})