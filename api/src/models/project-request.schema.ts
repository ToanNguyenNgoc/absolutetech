import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'project_requests',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
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

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const ProjectRequestSchema =
  SchemaFactory.createForClass(ProjectRequestModel);

export type ProjectRequestDocument = ProjectRequestModel & Document;
ProjectRequestSchema.plugin(mongooseLeanVirtuals);
ProjectRequestSchema.virtual('id').get(function () {
  return this._id.toString();
});
