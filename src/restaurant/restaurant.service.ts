// restaurant.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { AggregateOptions, Model, PipelineStage } from 'mongoose';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
@Injectable()
export class RestaurantService {
  logger: Logger;
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
  ) {
    this.logger = new Logger();
  }

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    this.logger.warn('createRestaurant service triggered!');
    const newRestaurant = new this.restaurantModel(createRestaurantDto);
    return await newRestaurant.save();
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    this.logger.warn('getAllRestaurants service triggered!');
    return await this.restaurantModel.find();
  }

  async getRestaurantById(restaurantId: string): Promise<Restaurant | null> {
    this.logger.warn(
      'getRestaurantById service triggered! with restaurantId',
      restaurantId,
    );
    return await this.restaurantModel.findById(restaurantId);
  }

  async updateRestaurant(
    restaurantId: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant | null> {
    this.logger.warn(
      'updateRestaurant service triggered! with restaurantId',
      restaurantId,
    );
    return await this.restaurantModel.findByIdAndUpdate(
      restaurantId,
      updateRestaurantDto,
      { new: true }, // Return the updated document
    );
  }

  async aggregate(
    pipeline: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<Restaurant[]> {
    return this.restaurantModel.aggregate(pipeline, options);
  }

  async addCuisineToRestaurant(
    restaurantId: string,
    addCuisineDto: any,
  ): Promise<Restaurant | null> {
    this.logger.warn(
      'addCuisineToRestaurant service triggered! with restaurantId',
      restaurantId,
    );
    const restaurant = await this.restaurantModel.findById(restaurantId);

    if (!restaurant) {
      return null;
    }
    restaurant.cuisines.push(addCuisineDto.cuisine);
    restaurant.userId = 'Test1234';
    return await restaurant.save();
  }

  async searchRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
    this.logger.warn(
      'searchRestaurantsByCuisine service triggered! with cuisine',
      cuisine,
    );
    console.log('restaurant=========', cuisine);
    return await this.restaurantModel.find({ cuisines: cuisine }); // Assuming cuisines stored as array
  }

  // Add methods for getting all restaurants, getting by id, updating, etc.
}
