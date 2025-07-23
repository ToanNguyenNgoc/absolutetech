import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type ShelfDocument = ShelfModel & Document;

@Schema({
  collection: 'shelfs',
  timestamps: true,
})
export class ShelfModel {
  @Prop({ required: false })
  type: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  code: string;

  @Prop({ required: false })
  num_rows: number;

  @Prop({ required: false })
  num_bin: number;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClusterModel',
  })
  cluster: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const ShelfSchema = SchemaFactory.createForClass(ShelfModel);

ShelfSchema.plugin(mongooseLeanVirtuals);

/**
 * Start
 *Thêm đoạn này cho tablet
 */

ShelfSchema.virtual('cluster_id').get(function () {
  return this.cluster._id.toString();
});

ShelfSchema.virtual('id').get(function () {
  return this._id.toString();
});

ShelfSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'type',
    'name',
    'num_rows',
    'num_bin',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */
