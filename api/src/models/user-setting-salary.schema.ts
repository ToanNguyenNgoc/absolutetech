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
  base_allowance: number;

  @Prop({ required: false, default: 0 })
  job_allowance: number;

  @Prop({ required: false, default: 0 })
  overtime: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const UserSettingSalarySchema = SchemaFactory.createForClass(
  UserSettingSalaryModel,
);
export type UserSettingSalaryDocument = UserSettingSalaryModel & Document;
UserSettingSalarySchema.plugin(mongooseLeanVirtuals);
