import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Creating swagger document config, with custom title and description
  const config = new DocumentBuilder()
    .setTitle('API del Proyecto Final del Bootcamp de CodigoFacilito (JS en el Backend)')
    .setDescription('Esta es una API que permite realizar las operaciones CRUD con dos modelos (usuarios y posts)')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  //we setup that document with the config created just before
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  //this is so we can use class validators globally, with the framework doing the validation automatically
  //when it detects that the info goes through one of them (in this case, we validate on the dtos)
  //we redirect all validator exceptions to a custom 400 response so a potential bot attack has a harder time bruteforcing through it
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException('One or more elements are missing or invalid in this request.');
    }
  }));

  await app.listen(3000);
}
bootstrap();
