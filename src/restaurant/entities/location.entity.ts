// location.interface.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Location {
  @Prop({ required: true })
  address: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
