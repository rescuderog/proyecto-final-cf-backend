import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const mongoUri = await mongod.getUri();
        return {
            uri: mongoUri,
            ...options
        }
    }
});

export const closeInMongodConnection = async () => {
    console.log('Mongod stop called');
    await mongoose.disconnect();
    console.log('Mongoose disconnected');
    if (mongod) await mongod.stop();
    console.log('Mongod stopped');
}