import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

@Schema({
    timestamps: true
})
/**
* Posts collection schema
*/
export class Post {

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    author: mongoose.Types.ObjectId;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: [String], required: true })
    categories: string[];

}

export const PostSchema = SchemaFactory.createForClass(Post);