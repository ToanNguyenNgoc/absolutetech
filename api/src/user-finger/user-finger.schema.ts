import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'user_finger',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class UserFinger {
  @Prop({ type: String, default: () => crypto.randomUUID() })
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: false })
  no?: number;

  @Prop({ type: String, required: false, default: null })
  finger_data?: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date | null;
}

export const UserFingerSchema = SchemaFactory.createForClass(UserFinger);

UserFingerSchema.pre('save', function (next) {
  if (!this.id) this.id = crypto.randomUUID();
  next();
});

UserFingerSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'user_id',
    'no',
    'finger_data',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
};

UserFingerSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deleted_at: null });
  next();
});

UserFingerSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });
};

UserFingerSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: null }, { new: true });
};
