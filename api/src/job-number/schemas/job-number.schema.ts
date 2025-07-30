import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as MongooseDocument } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type JobNumberDocument = JobNumber & MongooseDocument;

@Schema({
  collection: 'jobnumbers',
  timestamps: true,
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

  @Prop({ type: Date, default: null }) // Add deletedAt field
  deletedAt?: Date;
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

/**
 * Start
 *Thêm đoạn này cho tablet
 */
JobNumberSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

JobNumberSchema.virtual('assigned_to_id').get(function () {
  return this.assigned_to?._id?.toString?.() ?? null;
});

JobNumberSchema.virtual('created_by_id').get(function () {
  return this.created_by?._id?.toString?.() ?? null;
});

JobNumberSchema.plugin(mongooseLeanVirtuals);

JobNumberSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'code',
    'client',
    'location_at',
    'project',
    'assigned_to_id',
    'est_start_date',
    'est_end_date',
    'created_by_id',
    'status',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */

//virtuals relation ship
JobNumberSchema.virtual('project_request', {
  ref: 'ProjectRequestModel',
  localField: '_id',
  foreignField: 'job_number',
  justOne: true,
});

// Soft delete middleware
JobNumberSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deletedAt: null }); // Only return non-deleted documents
  next();
});

// Method to soft delete a user
JobNumberSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};
