import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type FileUploadDocument = FileUpload & Document;

@Schema({
  collection: 'fileuploads',
  timestamps: true,
})
export class FileUpload {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  size: number;

  @Prop()
  extension: string;

  @Prop()
  mime_type: string;

  @Prop()
  type?: string;

  @Prop({ index: true })
  ref_id: string;

  @Prop({ index: true })
  ref_model: string;

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: true })
  is_temp: boolean;

  @Prop({ type: Date, default: null }) // Add deletedAt field
  deletedAt?: Date;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);

FileUploadSchema.virtual('id').get(function () {
  return this._id.toString();
});
FileUploadSchema.plugin(mongooseLeanVirtuals);

FileUploadSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'name',
    'url',
    'size',
    'extension',
    'mime_type',
    'type',
    'ref_id',
    'ref_model',
    'is_deleted',
    'is_temp',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};
