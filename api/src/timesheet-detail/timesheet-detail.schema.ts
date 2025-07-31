import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'timesheet_details',
  timestamps: true,
})
export class TimesheetDetail {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timesheet',
    required: false,
  })
  timesheet?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  attendance?: mongoose.Types.ObjectId;

  @Prop()
  time_in?: string;

  @Prop()
  time_out?: string;

  @Prop()
  over_time?: string;

  @Prop({ default: false })
  on_rope: boolean;

  @Prop({ default: false })
  in_charge: boolean;

  @Prop({ default: false })
  other: boolean;

  @Prop()
  remarks?: string;

  @Prop()
  signature_tech?: string;

  @Prop()
  json_data?: string;

  @Prop()
  deletedAt?: Date;
}

export const TimesheetDetailSchema =
  SchemaFactory.createForClass(TimesheetDetail);

TimesheetDetailSchema.virtual('id').get(function () {
  return this._id.toString();
});

TimesheetDetailSchema.plugin(mongooseLeanVirtuals);

TimesheetDetailSchema.virtual('timesheet_id').get(function () {
  return this.timesheet?._id?.toString?.() ?? null;
});

TimesheetDetailSchema.virtual('attendance_id').get(function () {
  return this.attendance?._id?.toString?.() ?? null;
});

TimesheetDetailSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'timesheet_id',
    'attendance_id',
    'time_in',
    'time_out',
    'over_time',
    'on_rope',
    'in_charge',
    'other',
    'remarks',
    'signature_tech',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

TimesheetDetailSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate'],
  function (next) {
    this.where({ deletedAt: null });
    next();
  },
);

TimesheetDetailSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

TimesheetDetailSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
};
