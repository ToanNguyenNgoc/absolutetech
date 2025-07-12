import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'timesheets',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Timesheet {
  @Prop({ type: Types.ObjectId, ref: 'JobNumber', required: false })
  jobnumber_id?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  supervisor_id?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  office_supervisor_id?: string;
  @Prop()
  date_time?: Date;

  @Prop()
  signature?: string;

  @Prop()
  time_end?: Date;

  @Prop({ default: 'open' })
  status: string;

  @Prop()
  deleted_at?: Date;
}

export const TimesheetSchema = SchemaFactory.createForClass(Timesheet);

TimesheetSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'jobnumber_id',
    'supervisor_id',
    'date_time',
    'signature',
    'time_end',
    'status',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
};

TimesheetSchema.virtual('id').get(function () {
  return this._id.toString();
});

TimesheetSchema.plugin(mongooseLeanVirtuals);

TimesheetSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deleted_at: null });
  next();
});

TimesheetSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });
};

TimesheetSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: null }, { new: true });
};
