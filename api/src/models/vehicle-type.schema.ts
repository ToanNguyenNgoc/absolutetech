import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'vehicle_types',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class VehicleTypeModel {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false, default: false })
  is_active: boolean;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const VehicleTypeSchema = SchemaFactory.createForClass(VehicleTypeModel);
export type VehicleTypeDocument = VehicleTypeModel & Document;

VehicleTypeSchema.plugin(mongooseLeanVirtuals);
VehicleTypeSchema.virtual('id').get(function () {
  return this._id.toString();
});
