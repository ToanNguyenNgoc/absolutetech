import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type SpareDocument = SpareModel & Document;

@Schema({
  collection: 'spares',
  timestamps: true,
})
export class SpareModel {
  static TYPE = {
    CONSUMABLE: 'consumable',
    TTC: 'ttc',
    PERISHABLE: 'perishable',
    CE: 'ce',
    TORQUE_WRENCH: 'torque_wrench',
    OTHERS: 'others',
  };

  @Prop()
  name?: string;

  @Prop({ required: false })
  part_no: string;

  @Prop({ required: false })
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

  @Prop({ required: false })
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
  deletedAt?: Date;
}

export const SpareSchema = SchemaFactory.createForClass(SpareModel);
/**
 * Start
 *Thêm đoạn này cho tablet
 */

SpareSchema.plugin(mongooseLeanVirtuals);
SpareSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

SpareSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'name',
    'part_no',
    'material_no',
    'location',
    'supplier_email',
    'type',
    'mat_grp',
    'critical',
    'description',
    'url',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */
