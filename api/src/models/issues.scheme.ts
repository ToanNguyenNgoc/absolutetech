import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'issues',
  timestamps: true,
})
export class IssueModel {
  static RETURNED_ISSUE = 'issue';
  static RETURNED_RETURN = 'return';
  static RETURNED_WRITE_OFF = 'write off';

  @Prop({ required: false, default: 0 })
  quantity_request: number;

  @Prop({ required: false, default: 0 })
  quantity_origin: number;

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
    ref: 'BinModel',
  })
  bin: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

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

/**
 * Start
 *Thêm đoạn này cho tablet
 */

IssueSchema.plugin(mongooseLeanVirtuals);
IssueSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

IssueSchema.virtual('project_request_id').get(function () {
  return this.project_request?._id?.toString?.() ?? null;
});

IssueSchema.virtual('bin_configure_id').get(function () {
  return this.bin_configure?._id?.toString?.() ?? null;
});

IssueSchema.virtual('bin_id').get(function () {
  return this.bin?._id?.toString?.() ?? null;
});

IssueSchema.virtual('issue_to_id').get(function () {
  return this.issue_to?._id?.toString?.() ?? null;
});

IssueSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'quantity_request',
    'quantity_origin',
    'project_request_id',
    'bin_configure_id',
    'issue_to_id',
    'bin_id',
    'returned',
    'charge_time',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */
IssueSchema.virtual('id').get(function () {
  return this._id.toString();
});
