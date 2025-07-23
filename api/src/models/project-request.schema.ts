import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'project_requests',
  timestamps: true,
})
export class ProjectRequestModel {
  static PJ_STATUS_NEW = 'new';
  static PJ_STATUS_IN_PROCESS = 'in_process';
  static PJ_STATUS_ISSUE = 'issue';

  @Prop({ required: false })
  client: string;

  @Prop({ required: false })
  project_name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobNumber',
  })
  job_number: mongoose.Types.ObjectId;

  @Prop({ required: false })
  date_request: Date;

  @Prop({ required: false, default: ProjectRequestModel.PJ_STATUS_NEW })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  confirmed_by: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const ProjectRequestSchema =
  SchemaFactory.createForClass(ProjectRequestModel);

export type ProjectRequestDocument = ProjectRequestModel & Document;

/**
 * Start
 *Thêm đoạn này cho tablet
 */

ProjectRequestSchema.plugin(mongooseLeanVirtuals);
ProjectRequestSchema.virtual('id').get(function () {
  return this._id.toString();
});

ProjectRequestSchema.virtual('job_number_id').get(function () {
  return this.job_number._id.toString();
});

ProjectRequestSchema.virtual('created_by_id').get(function () {
  return this.created_by._id.toString();
});

ProjectRequestSchema.virtual('confirmed_by_id').get(function () {
  return this.confirmed_by._id.toString();
});

ProjectRequestSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'job_number_id',
    'created_by_id',
    'status',
    'confirmed_by_id',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */
