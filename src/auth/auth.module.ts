import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/db/schemas/user.schema";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '72h'
            }
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy
    ],
    exports: [AuthService]
})
export class AuthModule {
}