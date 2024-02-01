import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/db/schemas/user.schema";
import { Model } from "mongoose";
import { instanceToPlain, plainToClass } from "class-transformer";
import { UserLoginInfoDto } from "src/db/dto/user-login-info.dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    /**
     * Helper method to the Auth Module, to check against the database the username and password.
     * @param username string  Username as passed by the validateUser function
     * @param password string  Password as passed by the validateUser function
     * @returns Promise<UserLoginInfoDto> | null
     */
    async checkUserCreds(username: string, password: string): Promise<UserLoginInfoDto> {
        const userCheck = await this.userModel.findOne({ username: username }).lean();
        if (userCheck && await bcrypt.compare(password, userCheck.password)) {
            return plainToClass(UserLoginInfoDto, userCheck, { excludeExtraneousValues: true });
        } else {
            return null;
        }
    }

    /**
     * The method that validates the user credentials
     * @param username string
     * @param password string
     * @returns Promise<UserLoginInfoDto> | null
     */
    async validateUser(username: string, password: string): Promise<UserLoginInfoDto> {
        const checkUserCreds = this.checkUserCreds(username, password);
        if (checkUserCreds) {
            return checkUserCreds;
        } else {
            return null;
        }
    }

    /**
     * Method that signs and returns a jwt access token via an object.
     * @param user UserLoginInfoDto
     * @returns Promise<Object>
     */
    async login(user: UserLoginInfoDto): Promise<Object> {
        return {
            access_token: this.jwtService.sign(instanceToPlain(user), { secret: process.env.JWT_SECRET })
        };
    }
}