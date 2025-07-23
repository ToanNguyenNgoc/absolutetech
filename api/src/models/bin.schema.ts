import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'bins',
  timestamps: true,
})
export class BinModel {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClusterModel',
  })
  cluster: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShelfModel',
  })
  shelf: mongoose.Types.ObjectId;

  @Prop({ required: false })
  row: number;

  @Prop({ required: false })
  bin: number;

  @Prop({ required: false })
  drawer_name: string;

  @Prop({ required: false })
  status: string;

  // @Prop({ required: false })
  // quantity: number;

  // @Prop({ required: false })
  // quantity_oh: number;

  // @Prop({ required: false })
  // min: number;

  // @Prop({ required: false })
  // max: number;

  @Prop({ required: false })
  critical: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false, default: false })
  is_drawer: boolean;

  @Prop({ required: false, default: false })
  is_locked: boolean;

  @Prop({ required: false, default: false })
  is_failed: boolean;

  @Prop({ required: false, default: false })
  is_processing: boolean;

  @Prop({ required: false, default: false })
  is_faulty: boolean;

  @Prop({ required: false })
  process_time: Date;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  process_by: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const BinSchema = SchemaFactory.createForClass(BinModel);
export type BinDocument = BinModel & Document & { _id: Types.ObjectId };

/**
 * Start
 *Thêm đoạn này cho tablet
 */

BinSchema.plugin(mongooseLeanVirtuals);
BinSchema.virtual('id').get(function () {
  return this._id.toString();
});

BinSchema.virtual('cluster_id').get(function () {
  return this.cluster._id.toString();
});

BinSchema.virtual('shelf_id').get(function () {
  return this.shelf._id.toString();
});

BinSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'cluster_id',
    'shelf_id',
    'row',
    'bin',
    'status',
    'critical',
    'description',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */

BinSchema.virtual('bin_configures', {
  ref: 'BinConfigureModel',
  localField: '_id',
  foreignField: 'bin',
});
