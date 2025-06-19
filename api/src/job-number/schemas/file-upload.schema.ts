import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileUploadDocument = FileUpload & Document;

@Schema({ timestamps: true })
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
  mimeType: string;

  @Prop()
  type?: string; // e.g., job-doc, profile-img

  @Prop({ index: true })
  refId: string; // ID of the target entity (e.g., DocumentEntity._id)

  @Prop({ index: true })
  refModel: string; // Name of the target model: 'DocumentEntity', 'User', etc.

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ default: true })
  isTemp: boolean;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
