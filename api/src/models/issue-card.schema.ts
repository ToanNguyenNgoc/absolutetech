import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'issue_cards',
  timestamps: true,
})
export class IssueCardModel {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectRequestModel',
  })
  project_request: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssueModel',
  })
  issue: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  taker: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BinConfigureModel',
  })
  bin_configure: mongoose.Types.ObjectId;

  @Prop({ required: false })
  quantity: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const IssueCardSchema = SchemaFactory.createForClass(IssueCardModel);
export type IssueCardDocument = IssueCardModel & Document;

IssueCardSchema.plugin(mongooseLeanVirtuals);
IssueCardSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

IssueCardSchema.virtual('project_request_id').get(function () {
  return this.project_request?._id?.toString?.() ?? null;
});

IssueCardSchema.virtual('bin_configure_id').get(function () {
  return this.bin_configure?._id?.toString?.() ?? null;
});

IssueCardSchema.virtual('issue_id').get(function () {
  return this.issue?._id?.toString?.() ?? null;
});
IssueCardSchema.virtual('taker_id').get(function () {
  return this.taker?._id?.toString?.() ?? null;
});

IssueCardSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'quantity',
    'project_request_id',
    'bin_configure_id',
    'taker_id',
    'issue_id',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};
