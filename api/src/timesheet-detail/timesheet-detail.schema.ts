import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'timesheet_details',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TimesheetDetail {
  @Prop({ type: String, default: () => crypto.randomUUID() })
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'Timesheet' })
  timesheet_id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  attendance_id?: string;

  @Prop()
  time_in?: string;

  @Prop()
  time_out?: string;

  @Prop()
  over_time?: string;

  @Prop({ default: 0 })
  on_rope: number;

  @Prop({ default: 0 })
  in_charge: number;

  @Prop({ default: 0 })
  other: number;

  @Prop()
  remarks?: string;

  @Prop()
  signature_tech?: string;

  @Prop()
  json_data?: string;

  @Prop()
  deleted_at?: Date;
}

export const TimesheetDetailSchema =
  SchemaFactory.createForClass(TimesheetDetail);

TimesheetDetailSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'user_id',
    'no',
    'finger_data',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
};

TimesheetDetailSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate'],
  function (next) {
    this.where({ deleted_at: null });
    next();
  },
);

TimesheetDetailSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });
};

TimesheetDetailSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: null }, { new: true });
};
