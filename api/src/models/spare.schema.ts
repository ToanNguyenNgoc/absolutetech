import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type SpareDocument = SpareModel & Document;

@Schema({
  collection: 'spares',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class SpareModel {
  @Prop()
  name?: string;

  @Prop({ required: true })
  part_no: string;

  @Prop({ required: true })
  material_no: string;

  @Prop()
  location?: string;

  @Prop()
  supplier_email?: string;

  @Prop()
  mat_grp?: string;

  @Prop()
  cricode?: string;

  @Prop()
  jom?: string;

  @Prop()
  item_acct?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: false, default: false })
  has_batch_no?: boolean;

  @Prop({ required: false, default: false })
  has_serial_no?: boolean;

  @Prop({ required: false, default: false })
  has_charge_time?: boolean;

  @Prop({ required: false, default: false })
  has_calibration_due?: boolean;

  @Prop({ required: false, default: false })
  has_expiry_date?: boolean;

  @Prop({ required: false, default: false })
  has_load_hydrostatic_test_due?: boolean;

  @Prop({ required: false, default: false })
  has_verification: boolean;

  @Prop()
  field1?: string;

  @Prop()
  field2?: string;

  @Prop()
  url?: string;

  @Prop()
  description?: string;

  @Prop()
  auditor?: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const SpareSchema = SchemaFactory.createForClass(SpareModel);

SpareSchema.plugin(mongooseLeanVirtuals);
SpareSchema.virtual('id').get(function () {
  return this._id.toString();
});
