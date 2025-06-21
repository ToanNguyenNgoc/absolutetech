import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileUploadDocument = FileUpload & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class FileUpload {
  @Prop({ required: true })
  name: string; // Display name of the file

  @Prop({ required: true })
  url: string; // File URL (S3 or local)

  @Prop()
  size: number;

  @Prop()
  extension: string;

  @Prop()
  mime_type: string;

  @Prop()
  type?: string; // e.g., job-doc, profile-img

  @Prop({ index: true })
  ref_id: string; // ID of the target entity (e.g., DocumentEntity._id)

  @Prop({ index: true })
  ref_model: string; // Name of the target model: 'DocumentEntity', 'User', etc.

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: true })
  is_temp: boolean;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
