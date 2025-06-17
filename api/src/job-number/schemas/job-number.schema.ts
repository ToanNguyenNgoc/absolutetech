import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as MongooseDocument } from 'mongoose';

export type JobNumberDocument = JobNumber & MongooseDocument;

@Schema({ timestamps: true })
export class JobNumber {
  @Prop({ required: true, unique: true, index: true })
  code: string; // Unique Job Number code (JN#)

  @Prop({ required: true })
  project: string; // Project name

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignedTo: mongoose.Types.ObjectId; // Person responsible (Line #1)

  @Prop({ type: Date, required: false })
  estStartDate?: Date;

  @Prop({ type: Date, required: false })
  estEndDate?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId; // User who created the job

  @Prop({ default: 'open', index: true })
  status: string; // Job status: open, closed, approved
}

export const JobNumberSchema = SchemaFactory.createForClass(JobNumber);

JobNumberSchema.virtual('documents', {
  ref: 'DocumentEntity',
  localField: '_id',
  foreignField: 'jobNumber',
  justOne: false,
});

JobNumberSchema.set('toObject', { virtuals: true });
JobNumberSchema.set('toJSON', { virtuals: true });
