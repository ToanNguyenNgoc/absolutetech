import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserFingerDocument = UserFinger & Document;

@Schema({ collection: 'user_finger', timestamps: true }) // ✅ timestamps sẽ tự thêm createdAt & updatedAt
export class UserFinger {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: false }) // ✅ Đảm bảo kiểu số rõ ràng
  no?: number;

  @Prop({ type: String, required: false, default: null }) // ✅ Tránh lỗi nếu null
  finger_data?: string;
}

export const UserFingerSchema = SchemaFactory.createForClass(UserFinger);
