import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/db/dto/create-user.dto";
import { UpdateUserDto } from "src/db/dto/update-user.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { SelectUserDto } from "src/db/dto/select-user.dto";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserLoginDto } from "src/db/dto/user-login.dto";

@ApiTags('users')
@Controller("users")
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
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
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Return status: success on correct update. If not, it returns an error.' })
    @ApiResponse({ status: 400, description: 'One or more of the fields are invalid or are missing in the request.' })
    @ApiResponse({ status: 401, description: "You don't have enough permissions to perform this action." })
    @ApiBearerAuth('JWT-auth')
    async updateUser(@Param('id') id: string, @Body() params: UpdateUserDto, @Request() req): Promise<Object> {
        if (id === req.user._id || req.user.isAdmin) {
            try {
                const data = await this.usersService.updateUser(id, params);
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
    async deleteUser(@Param('id') id: string, @Request() req): Promise<Object> {
        if (req.user.isAdmin) {
            try {
                const data = await this.usersService.deleteUser(id);
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

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiResponse({ status: 201, description: 'Returns a bearer token on success, nothing on fail' })
    async loginUser(@Body() loginInfo: UserLoginDto, @Request() req): Promise<Object> {
        return this.authService.login(req.user);
    }

}