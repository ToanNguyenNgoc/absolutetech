import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as MongooseDocument } from 'mongoose';

export type JobNumberDocument = JobNumber & MongooseDocument;

@Schema({
  collection: 'jobnumbers',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class JobNumber {
  @Prop({ required: true, unique: true, index: true })
  code: string; // Unique Job Number code (JN#)

  @Prop({ required: true })
  project: string;

  @Prop({ required: true })
  location_at: string;

  @Prop({ required: true })
  client: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  assigned_to: mongoose.Types.ObjectId;

  @Prop({ type: Date, required: false })
  est_start_date?: Date;

  @Prop({ type: Date, required: false })
  est_end_date?: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: mongoose.Types.ObjectId;

  @Prop({ default: 'open', index: true })
  status: string; // Job status: open, closed, approved

  @Prop({ type: Date, default: null }) // Add deleted_at field
  deleted_at: Date | null;
}

export const JobNumberSchema = SchemaFactory.createForClass(JobNumber);

JobNumberSchema.virtual('documents', {
  ref: 'DocumentEntity',
  localField: '_id',
  foreignField: 'job_number',
  justOne: false,
});

JobNumberSchema.set('toObject', { virtuals: true });
JobNumberSchema.set('toJSON', { virtuals: true });

JobNumberSchema.virtual('id').get(function () {
  return this._id;
});

JobNumberSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'code',
    'client',
    'location_at',
    'project',
    'assigned_to', //super_visor
    'est_start_date',
    'est_end_date',
    'created_by',
    'status',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
};
