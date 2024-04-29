// cuisine.interface.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cuisine {
  @Prop({ required: true })
  name: string;
}

export const CuisineSchema = SchemaFactory.createForClass(Cuisine);
