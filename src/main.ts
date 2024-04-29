// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe, VersioningType } from '@nestjs/common';
// import helmet from 'helmet';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as compression from 'compression';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({ origin: '*' });
//   app.useGlobalPipes(new ValidationPipe({}));
//   app.enableVersioning({ type: VersioningType.URI });
//   app.use(helmet());
//   // app.enableCors({
//   //   // add multiple origins here
//   //   origin: [
//   //     'https://thriveread.com/',
//   //     'http://localhost:5000/',
//   //     'http://yourclient.com',
//   //   ],
//   // });

//   const config = new DocumentBuilder()
//     .setTitle('Restaurants API Documentation')
//     .setDescription('The Restaurants API description')
//     .setVersion('1.0')
//     .addTag('Restaurants')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);
//   app.use(compression());

//   await app.listen(4000);
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 8888,
    },
  });
  await app.listen();
}
bootstrap();
