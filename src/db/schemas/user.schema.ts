import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true
})
/**
* Users collection schema
*/
export class User {

    @Prop({ type: String, required: true, unique: true })
    username: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: Boolean, required: true, default: false })
    isAdmin: boolean;

    @Prop({ type: String, required: false })
    name: string;

    @Prop({ type: Number, required: true })
    age: number;

}

export const UserSchema = SchemaFactory.createForClass(User);