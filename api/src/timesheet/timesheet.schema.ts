import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'timesheets',
  timestamps: true,
})
export class Timesheet {
  static STATUS = {
    OPEN: 'open',
    REOPEN: 'reopen',
    DONE: 'done',
    APPROVE: 'approve',
    CLOSED: 'closed',
  };

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobNumber',
    // required: false,
  })
  jobnumber?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  supervisor: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  office_supervisor?: mongoose.Types.ObjectId;

  @Prop()
  date_time?: Date;

  @Prop()
  signature?: string;

  @Prop()
  time_end?: Date;

  @Prop({ default: 'open' })
  status: string;

  @Prop()
  deletedAt?: Date;
}

export const TimesheetSchema = SchemaFactory.createForClass(Timesheet);
export type TimesheetDocument = Timesheet & Document & { _id: Types.ObjectId };

TimesheetSchema.virtual('id').get(function () {
  return this._id?.toString?.();
});

TimesheetSchema.plugin(mongooseLeanVirtuals);

TimesheetSchema.virtual('jobnumber_id').get(function () {
  return this.jobnumber?._id?.toString?.() ?? null;
});
TimesheetSchema.virtual('supervisor_id').get(function () {
  return this.supervisor?._id?.toString?.() ?? null;
});

TimesheetSchema.virtual('office_supervisor_id').get(function () {
  return this.office_supervisor?._id?.toString?.() ?? null;
});

TimesheetSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'jobnumber_id',
    'supervisor_id',
    'office_supervisor_id',
    'date_time',
    'signature',
    'time_end',
    'status',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

TimesheetSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deletedAt: null });
  next();
});

TimesheetSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

TimesheetSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
};
