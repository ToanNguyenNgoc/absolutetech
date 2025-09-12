import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, Role } from './user.enums';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: true,
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

  @Prop({ required: false })
  position: string;

  @Prop({
    type: String,
    // enum: Gender,
    required: false,
  })
  gender: Gender;

  @Prop({ required: false })
  birthday: Date;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: false })
  nric_fin: string;

  @Prop({ required: false })
  work_permit_expiry: Date;

  @Prop({ type: Date, default: null }) // Add deletedAt field
  deletedAt: Date | null;
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
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

UserSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

UserSchema.plugin(mongooseLeanVirtuals);

// Soft delete middleware
UserSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ deletedAt: null }); // Only return non-deleted documents
  next();
});

// Method to soft delete a user
UserSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

// Method to restore a soft-deleted user
UserSchema.statics.restore = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
};
