import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'user_setting_salaries',
  timestamps: true,
})
export class UserSettingSalaryModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  user: mongoose.Types.ObjectId;

  @Prop({ required: false, default: 0 })
  basic_salary: number;

  @Prop({ required: false, default: 0 })
  allowance_monthly: number;

  @Prop({ required: false, default: 0 })
  levy: number;

  @Prop({ required: false, default: 0 })
  allowance_on_rope: number;

  @Prop({ required: false, default: 0 })
  allowance_indoor: number;

  @Prop({ required: false, default: 0 })
  allowance_night_job: number;

  @Prop({ required: false, default: 0 })
  allowance_training: number;

  @Prop({ required: false, default: 0 })
  allowance_shipyard_smaller_5_hours: number;

  @Prop({ required: false, default: 0 })
  allowance_shipyard_greater_5_hours: number;

  @Prop({ required: false, default: 0 })
  allowance_overseas_weekday: number;

  @Prop({ required: false, default: 0 })
  allowance_others: number;

  @Prop({ required: false, default: 0 })
  overtime_1_5: number;

  @Prop({ required: false, default: 0 })
  overtime_2_0: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const UserSettingSalarySchema = SchemaFactory.createForClass(
  UserSettingSalaryModel,
);
export type UserSettingSalaryDocument = UserSettingSalaryModel & Document;
UserSettingSalarySchema.plugin(mongooseLeanVirtuals);
