// restaurant.controller.ts
import { Controller, Body, Get, Inject, Logger } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './entities/restaurant.entity';
import {
  AddCuisineDto,
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from './dto/restaurant.dto';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CuisineService } from 'src/cuisine/cuisine.service';
import { Cuisine } from './entities/cuisine.entity';
import { ApiOkResponse } from '@nestjs/swagger';
export class Message {
  text: string;
  constructor(text) {
    this.text = text;
  }
}
@Controller('restaurants')
export class RestaurantController {
  logger: Logger;

  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly cuisineService: CuisineService,
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {
    this.subscribersService.connect();
    console.log('this.subscribersService', this.subscribersService);
    this.logger = new Logger();
  }

  @ApiOkResponse({ description: 'returns the createRestaurant response' })
  // @Throttle({ default: { limit: 3, ttl: 5000 } })
  @MessagePattern({ cmd: 'createRestaurant' })
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    console.log('createRestaurantDto', createRestaurantDto);
    this.subscribersService.emit<any>('send_email', {
      email: createRestaurantDto.email,
      subject: 'Welcome to Foodzap Restaurants!',
      template: './welcome-mail',
      name: createRestaurantDto.name,
    });
    this.logger.warn(
      'createRestaurant triggered with createRestaurantDto! check the Rabbit queue info',
      this.subscribersService,
    );

    return await this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @ApiOkResponse({ description: 'returns the getRestaurantById response' })
  @MessagePattern({ cmd: 'getRestaurantById' })
  async getRestaurantById(
    @Body() restaurantId: string,
  ): Promise<Restaurant | null> {
    return await this.restaurantService.getRestaurantById(restaurantId);
  }

  // @ApiOkResponse({ description: 'returns the getAllRestaurants response' })
  // @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  // @CacheKey('getAllRestaurants-key')
  // @CacheTTL(60000) // now in milliseconds (1 minute === 60000)
  @MessagePattern({ cmd: 'getAllRestaurants' })
  async getAllRestaurants(): Promise<Restaurant[]> {
    return await this.restaurantService.getAllRestaurants();
  }

  @ApiOkResponse({ description: 'returns the updateRestaurant response' })
  @MessagePattern({ cmd: 'updateRestaurant' })
  async updateRestaurant(
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant | null> {
    const data: any = { ...updateRestaurantDto };
    const restaurantId = data.id;
    delete data?.id;
    return await this.restaurantService.updateRestaurant(restaurantId, data);
  }

  @ApiOkResponse({ description: 'returns the addCuisineToRestaurant response' })
  @MessagePattern({ cmd: 'addCuisineToRestaurant' })
  async addCuisineToRestaurant(
    @Body() addCuisineDto: AddCuisineDto,
  ): Promise<Restaurant | null> {
    return await this.restaurantService.addCuisineToRestaurant(
      addCuisineDto.restId,
      addCuisineDto,
    );
  }

  @ApiOkResponse({ description: 'returns the getAllCuisines response' })
  @MessagePattern({ cmd: 'getAllCuisines' })
  @Get('/cuisines')
  async getAllCuisines(): Promise<Cuisine[]> {
    return await this.cuisineService.getAllCuisines();
  }

  @ApiOkResponse({
    description: 'returns the searchRestaurantsByCuisine response',
  })
  // @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  // @CacheKey('searchRestaurantsByCuisine-key')
  // @CacheTTL(60000) // now in milliseconds (1 minute === 60000)
  @MessagePattern({ cmd: 'searchRestaurantsByCuisine' })
  async searchRestaurantsByCuisine(
    @Body() cuisine: string,
  ): Promise<Restaurant[]> {
    return await this.restaurantService.searchRestaurantsByCuisine(cuisine);
  }
}
