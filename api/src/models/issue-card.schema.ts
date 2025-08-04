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
