import { Test, TestingModule } from "@nestjs/testing"
import { User } from "src/db/schemas/user.schema"
import { getModelToken } from '@nestjs/mongoose'
import { UsersService } from "src/users/users.service"
import { Model } from "mongoose"
import { mockEmptyUser, mockResultUser, mockUser } from "../mocks/users.stub"
import * as ct from 'class-transformer'
import { BadRequestException, NotFoundException } from "@nestjs/common"

describe('UsersService', () => {

    let usersService: UsersService
    let model: Model<User>;
    const mockUsersService = {
        findById: jest.fn(),
        find: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUsersService
                }
            ]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        model = module.get<Model<User>>(getModelToken(User.name));
    })

    describe('findOne', () => {
        it('should throw an exception if the ID is not a valid ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockEmptyUser);

            await expect(usersService.findOne('test123')).rejects.toThrow(BadRequestException);
            expect(model.findById).not.toHaveBeenCalled();
        });

        it('should throw an exception if the User is not found', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockEmptyUser);
            jest.spyOn(ct, 'plainToClass');

            await expect(usersService.findOne('5ce819935e539c343f141ece')).rejects.toThrow(NotFoundException);
            expect(ct.plainToClass).not.toHaveBeenCalled();
        });

        it('should find and return a User by ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(ct, 'plainToClass');

            const result = await usersService.findOne(mockUser._id);

            expect(model.findById).toHaveBeenCalledWith(mockUser._id);
            expect(ct.plainToClass).toHaveBeenCalled();
            expect(result).toEqual(mockResultUser);
        });
    })
})