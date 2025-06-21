import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, Role } from './user.enums';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: { created_at: 'created_at', updated_at: 'updated_at' },
})
export class User {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  employee_id: string;

  @Prop({ unique: true, sparse: true })
  employee_hik: string;

  @Prop({ default: 0 })
  is_sync: number;

  @Prop()
  face_hik: string;

  @Prop({
    type: Number,
    enum: Role,
    default: Role.SUPERVISOR,
  })
  role: Role;

  @Prop()
  position: string;

  @Prop({
    type: String,
    enum: Gender,
  })
  gender: Gender;

  @Prop()
  birthday: Date;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  nric_fin: string;

  @Prop()
  work_permit_expiry: Date;

  @Prop({ type: Date, default: null }) // Add deleted_at field
  deleted_at: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('userFingers', {
  ref: 'UserFinger',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

// Static sync columns configuration
UserSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'full_name',
    'username',
    'employee_id',
    'employee_hik',
    'is_sync',
    'face_hik',
    'role',
    'position',
    'gender',
    'birthday',
    'phone',
    'address',
    'email',
    'password',
    'avatar',
    'nric_fin',
    'work_permit_expiry',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
};

// Soft delete middleware
UserSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deleted_at: null }); // Only return non-deleted documents
  next();
});

// Method to soft delete a user
UserSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });
};

// Method to restore a soft-deleted user
UserSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deleted_at: null }, { new: true });
};
