import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'normal_working_hours',
  timestamps: true,
})
export class NormalWorkingHourModel {
  static WEEKDAYS = {
    SUNDAY: 'SUNDAY',
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'WEDNESDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
  };

  @Prop({ required: true })
  weekday: string;

  @Prop({ required: true })
  time_start: string;

  @Prop({ required: true })
  time_end: string;

  @Prop({ required: false, default: 0 })
  priority: number;

  @Prop({ required: false, default: 0 })
  hours: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const NormalWorkingHourSchema = SchemaFactory.createForClass(
  NormalWorkingHourModel,
);
export type NormalWorkingHourDocument = NormalWorkingHourModel & Document;
NormalWorkingHourSchema.plugin(mongooseLeanVirtuals);
