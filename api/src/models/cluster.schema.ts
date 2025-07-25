import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type ClusterDocument = ClusterModel & Document;

@Schema({
  collection: 'clusters',
  timestamps: true,
})
export class ClusterModel {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  code?: string;

  @Prop({ required: false, default: true })
  status: boolean;

  @Prop({ required: false, default: true })
  is_online: boolean;

  @Prop({ type: Boolean, default: false })
  is_rfid: boolean;

  @Prop({ type: Boolean, default: false })
  is_virtual: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const ClusterSchema = SchemaFactory.createForClass(ClusterModel);

/**
 * Start
 *Thêm đoạn này cho tablet
 */

ClusterSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

ClusterSchema.plugin(mongooseLeanVirtuals);

ClusterSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'name',
    'code',
    'is_online',
    'is_rfid',
    'is_virtual',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */

ClusterSchema.virtual('shelfs', {
  ref: 'ShelfModel',
  localField: '_id',
  foreignField: 'cluster',
});
