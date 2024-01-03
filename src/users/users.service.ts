import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/db/dto/create-user.dto";
import { UpdateUserDto } from "src/db/dto/update-user.dto";
import { User } from "src/db/schemas/user.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async findAll(): Promise<User[]> {
        return this.userModel.find({}, { username: 1, email: 1, age: 1, _id: 1 }).lean();
    }

    async findOne(id): Promise<User> {
        return this.userModel.findById(id, { username: 1, email: 1, age: 1, _id: 1 }).lean();
    }

    async createUser(data: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(data);
        return createdUser.save();
    }

    async updateUser(id: string, params: UpdateUserDto): Promise<User> {
        return this.userModel.updateOne({ _id: id }, params).lean();
    }

    async deleteUser(id: string): Promise<User> {
        return this.userModel.deleteOne({ _id: id }).lean();
    }
}