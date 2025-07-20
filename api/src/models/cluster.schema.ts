import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type ClusterDocument = ClusterModel & Document;

@Schema({
  collection: 'clusters',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ClusterModel {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  code?: string;

  @Prop({ required: false, default: true })
  status: boolean;

  @Prop({ type: Boolean, default: false })
  is_rfid: boolean;

  @Prop({ type: Boolean, default: false })
  is_virtual: boolean;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const ClusterSchema = SchemaFactory.createForClass(ClusterModel);

ClusterSchema.plugin(mongooseLeanVirtuals);
ClusterSchema.virtual('id').get(function () {
  return this._id.toString();
});
ClusterSchema.virtual('shelfs', {
  ref: 'ShelfModel',
  localField: '_id',
  foreignField: 'cluster',
});
