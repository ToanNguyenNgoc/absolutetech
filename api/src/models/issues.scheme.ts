import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'issues',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class IssueModel {
  static RETURNED_ISSUE = 'issue';
  static RETURNED_RETURN = 'return';
  static RETURNED_WRITE_OFF = 'write off';

  @Prop({ required: false, default: 0 })
  quantity_request: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectRequestModel',
  })
  project_request: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BinConfigureModel',
  })
  bin_configure: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpareModel',
  })
  spare: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  issue_to: mongoose.Types.ObjectId;

  @Prop({ required: false })
  returned: string;
}

export const IssueSchema = SchemaFactory.createForClass(IssueModel);

export type IssueDocument = IssueModel & Document;

IssueSchema.plugin(mongooseLeanVirtuals);
IssueSchema.virtual('id').get(function () {
  return this._id.toString();
});
