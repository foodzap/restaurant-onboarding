// restaurant.class.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Restaurant {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Location' })
  locationId: string;

  @Prop([String]) // Array of strings for cuisines
  cuisines: string[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
