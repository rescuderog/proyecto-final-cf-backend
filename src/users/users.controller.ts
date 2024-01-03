import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/db/dto/create-user.dto";
import { User } from "src/db/schemas/user.schema";
import { UpdateUserDto } from "src/db/dto/update-user.dto";

@ApiTags('users')
@Controller("users")
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async getSpecificUser(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post()
    async createUser(@Body() createDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createDto);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() params: UpdateUserDto): Promise<User> {
        return this.usersService.updateUser(id, params);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<User> {
        return this.usersService.deleteUser(id);
    }
}