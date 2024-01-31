import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/db/dto/create-user.dto";
import { User } from "src/db/schemas/user.schema";
import { UpdateUserDto } from "src/db/dto/update-user.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { SelectUserDto } from "src/db/dto/select-user.dto";

@ApiTags('users')
@Controller("users")
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) { }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of all users or an Error.' })
    async getAllUsers(): Promise<SelectUserDto[]> {
        try {
            const data = await this.usersService.findAll();
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Returns an specific user if it matches the id in the DB or an Error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    async getSpecificUser(@Param('id') id: string): Promise<SelectUserDto> {
        try {
            const data = await this.usersService.findOne(id);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Returns the user data that has been created or an Error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    async createUser(@Body() createDto: CreateUserDto): Promise<SelectUserDto> {
        try {
            const data = await this.usersService.createUser(createDto);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 201 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.CREATED);
        }
    }

    @Put(':id')
    @ApiResponse({ status: 201, description: 'Return status: success on correct update. If not, it returns an error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    async updateUser(@Param('id') id: string, @Body() params: UpdateUserDto): Promise<Object> {
        try {
            const data = await this.usersService.updateUser(id, params);
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
    async deleteUser(@Param('id') id: string): Promise<Object> {
        try {
            const data = await this.usersService.deleteUser(id);
            return data;
        } catch (e) {
            this.logger.error(e);
            //we throw a 200 code anyways in case of an error in order to prevent bots to scan for vulnerabilities via the status code change
            throw new HttpException('Error. Try Again', HttpStatus.OK);
        }
    }
}