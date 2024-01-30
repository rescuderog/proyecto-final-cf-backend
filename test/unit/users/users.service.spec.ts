import { Test, TestingModule } from "@nestjs/testing"
import { User, UserSchema } from "src/db/schemas/user.schema"
import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { UsersService } from "src/users/users.service"
import mongoose, { Model } from "mongoose"
import { mockCreateUserData, mockEmptyUser, mockResultUser, mockUser } from "../mocks/users.stub"
import * as ct from 'class-transformer'
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { closeInMongodConnection, rootMongooseTestModule } from "test/utils/MongooseTestModule"
import { SelectUserDto } from "src/db/dto/select-user.dto"

describe('UsersService', () => {

    let usersService: UsersService
    let model: Model<User>;
    let mockResultUserWithId: SelectUserDto;

    const ctSpy = jest.spyOn(ct, 'plainToClass');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{
                    name: User.name, schema: UserSchema
                }])
            ],
            providers: [
                UsersService
            ]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        model = module.get<Model<User>>(getModelToken(User.name));
    })

    describe('createUser', () => {
        it('should create an user and return an object with some data of the created user', async () => {
            jest.spyOn(model, 'create');

            const result = await usersService.createUser(mockCreateUserData);

            expect(model.create).toHaveBeenCalledWith(mockCreateUserData);
            expect(ct.plainToClass).toHaveBeenCalled();
            ctSpy.mockClear();

            mockResultUserWithId = { _id: result._id, ...mockResultUser };
            expect(result).toEqual(mockResultUserWithId);
        });
    });

    describe('findOne', () => {
        it('should throw a BadRequestException if the ID is not a valid ID', async () => {
            jest.spyOn(model, 'findById');

            await expect(usersService.findOne('test123')).rejects.toThrow(BadRequestException);
            expect(model.findById).not.toHaveBeenCalled();
        });

        it('should throw a NotFoundException if the User is not found', async () => {

            await expect(usersService.findOne('5ce819935e539c343f141ece')).rejects.toThrow(NotFoundException);
            expect(ct.plainToClass).not.toHaveBeenCalled();
        });

        it('should find and return a User by ID', async () => {
            const createdUser = await usersService.createUser(mockCreateUserData);
            mockResultUserWithId = { _id: createdUser._id, ...mockResultUser };

            const result = await usersService.findOne(createdUser._id);

            expect(ct.plainToClass).toHaveBeenCalled();
            expect(result).toEqual(mockResultUserWithId);
        });
    });

    describe('findAll', () => {
        it('should return an array of results', async () => {
            const createdUser = await usersService.createUser(mockCreateUserData);
            mockResultUserWithId = { _id: createdUser._id, ...mockResultUser };

            const result = await usersService.findAll();
            console.log(result);

            expect(result).toEqual([mockResultUserWithId]);
        });
    });

    afterAll(async () => {
        jest.setTimeout(20000)
        await closeInMongodConnection();
    });
})