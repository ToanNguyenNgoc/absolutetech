import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'holidays',
  timestamps: true,
})
export class HolidayModel {
  static toMonthDayUTC(d: Date | string) {
    const date = new Date(d);
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${mm}-${dd}`;
  }

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  date: Date;

  @Prop({ type: String, required: true, index: true })
  monthDay: string; // Ex: "12-25"

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const HolidaySchema = SchemaFactory.createForClass(HolidayModel);
export type HolidayDocument = HolidayModel & Document;
HolidaySchema.plugin(mongooseLeanVirtuals);
