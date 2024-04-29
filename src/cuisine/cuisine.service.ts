// cuisine.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cuisine } from 'src/restaurant/entities/cuisine.entity';

@Injectable()
export class CuisineService {
  constructor(
    @InjectModel(Cuisine.name) private readonly cuisineModel: Model<Cuisine>,
  ) {}

  async getAllCuisines(): Promise<Cuisine[]> {
    return await this.cuisineModel.find();
  }

  // Add methods for creating, updating, deleting cuisines (if applicable)
}
