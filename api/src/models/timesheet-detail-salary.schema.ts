import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'timesheet_detail_salaries',
  timestamps: true,
})
export class TimesheetDetailSalaryModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobNumber',
    required: false,
  })
  jobnumber?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timesheet',
    required: false,
  })
  timesheet?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimesheetDetail',
    required: false,
  })
  timesheet_detail?: mongoose.Types.ObjectId;

  @Prop({ required: false, default: 0 })
  total_allowance_salary: number;

  @Prop({ required: false, default: 0 })
  overtime_salary: number;

  @Prop({ required: false, default: 0 })
  penalty: number;

  @Prop({ required: false })
  date_record: Date;
}

export const TimesheetDetailSalarySchema = SchemaFactory.createForClass(
  TimesheetDetailSalaryModel,
);
export type TimesheetDetailSalaryDocument = TimesheetDetailSalaryModel &
  Document;
TimesheetDetailSalarySchema.plugin(mongooseLeanVirtuals);
