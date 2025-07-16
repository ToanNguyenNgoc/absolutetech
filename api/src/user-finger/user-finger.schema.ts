import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'user_finger',
  timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' },
})
export class UserFinger {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: false })
  no?: number;

  @Prop({ type: String, required: false, default: null })
  finger_data?: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const UserFingerSchema = SchemaFactory.createForClass(UserFinger);

UserFingerSchema.virtual('id').get(function () {
  return this._id.toString();
});

UserFingerSchema.virtual('user_id').get(function () {
  return this.user._id.toString();
});

UserFingerSchema.plugin(mongooseLeanVirtuals);

UserFingerSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'user_id',
    'no',
    'finger_data',
    'createdAt',
    'createdAt',
    'deletedAt',
  ];
};

UserFingerSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deletedAt: null });
  next();
});

UserFingerSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

UserFingerSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
};
