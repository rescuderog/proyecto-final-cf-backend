import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToClass } from "class-transformer";
import { Model, isValidObjectId } from "mongoose";
import { CreateUserDto } from "src/db/dto/create-user.dto";
import { SelectUserDto } from "src/db/dto/select-user.dto";
import { UpdateUserDto } from "src/db/dto/update-user.dto";
import { User } from "src/db/schemas/user.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    /**
     * Returns every user's username, email, age and internal id.
     * @returns Promise<SelectUserDto[]>
     */
    async findAll(): Promise<SelectUserDto[]> {
        return this.userModel.find({}, { username: 1, email: 1, age: 1, _id: 1 }).lean();
    }

    /**
     * Returns one user's username, email, age and internal id.
     * @param id string The id of the user.
     * @returns Promise<SelectUserDto>
     */
    async findOne(id: string): Promise<SelectUserDto> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('The ID inputted: ' + id + ' is not valid.');
        }

        const user = await this.userModel.findById(id);

        if (!user) {
            throw new NotFoundException('There is no user with an ID of ' + id);
        }

        return plainToClass(SelectUserDto, user.toJSON(), { excludeExtraneousValues: true });
    }

    /**
     * Creates the user using the model defined in the DTO. Returns the success information of the query if the user is created.
     * @param data CreateUserDto    The data used to create the user
     * @returns Promise<SelectUserDto>
     */
    async createUser(data: CreateUserDto): Promise<SelectUserDto> {
        const createdUser = new this.userModel(data);
        const dataReturned = await createdUser.save();
        return plainToClass(SelectUserDto, dataReturned.toJSON(), { excludeExtraneousValues: true });
    }

    /**
     * Attempts to update the user with the id parameter. Returns the success information of the query if the user is updated.
     * @param id string    The id of the user
     * @param params UpdateUserDto    The data used to create the user
     * @returns Promise<User>
     */
    async updateUser(id: string, params: UpdateUserDto): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('The ID inputted: ' + id + 'is not valid.');
        }

        return this.userModel.updateOne({ _id: id }, params).lean();
    }

    /**
     * Attempts to delete the user with the id parameter. Returns the success information of the query if the user is deleted.
     * @param id string    The id of the user
     * @returns Promise<User> 
     */
    async deleteUser(id: string): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('The ID inputted: ' + id + 'is not valid.');
        }

        return this.userModel.deleteOne({ _id: id }).lean();
    }
}