import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'user_finger', timestamps: true }) // ✅ timestamps sẽ tự thêm createdAt & updatedAt
export class UserFinger {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: false }) // ✅ Đảm bảo kiểu số rõ ràng
  no?: number;

  @Prop({ type: String, required: false, default: null }) // ✅ Tránh lỗi nếu null
  finger_data?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null }) // Add deletedAt field
  deletedAt: Date | null;
}

export const UserFingerSchema = SchemaFactory.createForClass(UserFinger);

UserFingerSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'user',
    'no',
    'finger_data',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

// Soft delete middleware
UserFingerSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deletedAt: null }); // Only return non-deleted documents
  next();
});

// Method to soft delete a user finger
UserFingerSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

// Method to restore a soft-deleted user finger
UserFingerSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
};
