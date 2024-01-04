import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Creating swagger document config, with custom title and description
  const config = new DocumentBuilder()
    .setTitle('API del Proyecto Final del Bootcamp de CodigoFacilito (JS en el Backend)')
    .setDescription('Esta es una API que permite realizar las operaciones CRUD con dos modelos (usuarios y posts)')
    .setVersion('0.1')
    .build();

  //we setup that document with the config created just before
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  //this is so we can use class validators globally, with the framework doing the validation automatically
  //when it detects that the info goes through one of them (in this case, we validate on the dtos)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
