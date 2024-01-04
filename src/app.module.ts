import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike()
      ),
      transports: [
        new winston.transports.File({
          filename: './logs/error-log.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: './logs/non-error.log'
        })
      ]
    }),
    UsersModule,
    PostsModule
  ],
})
export class AppModule { }
