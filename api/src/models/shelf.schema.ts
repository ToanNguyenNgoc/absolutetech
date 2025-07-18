import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type ShelfDocument = ShelfModel & Document;

@Schema({
  collection: 'shelfs',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
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
}

export const ShelfSchema = SchemaFactory.createForClass(ShelfModel);

ShelfSchema.plugin(mongooseLeanVirtuals);
ShelfSchema.virtual('id').get(function () {
  return this._id.toString();
});
