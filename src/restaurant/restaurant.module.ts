import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Restaurant, RestaurantSchema } from './entities/restaurant.entity';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CuisineService } from 'src/cuisine/cuisine.service';
import { Cuisine, CuisineSchema } from './entities/cuisine.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Cuisine.name, schema: CuisineSchema },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    CuisineService,
    {
      provide: 'SUBSCRIBERS_SERVICE',
      useFactory: (configService: ConfigService) => {
        // const user = configService.get('RABBITMQ_USER');
        // const password = configService.get('RABBITMQ_PASSWORD');
        // const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');
        // const rabbitURI = configService.get('RABBIT_URI');

        const RABBITMQ_HOST =
          'amqps://admin:VMWare@amato786@b-59def88a-b747-4d96-8db4-868797d3c475.mq.us-east-1.amazonaws.com:5671';

        const RABBITMQ_QUEUE_NAME = 'email-subscribers';

        console.log('queueName', queueName);
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [RABBITMQ_HOST],
            queue: RABBITMQ_QUEUE_NAME,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class RestaurantModule {}
