import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'transactions',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TransactionModel {
  static TYPE_ISSUE = 'issue';
  static TYPE_CREATE_BIN_CONFIGURE = 'create_bin_configure';

  static STATUS_DONE = 'done';

  @Prop({ required: false })
  transaction_type: string;

  @Prop({ required: false, default: TransactionModel.STATUS_DONE })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  request_by: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);

TransactionSchema.plugin(mongooseLeanVirtuals);
TransactionSchema.virtual('id').get(function () {
  return this._id.toString();
});
