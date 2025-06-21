import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as MongooseDocument } from 'mongoose';

export type DocumentEntityDocument = DocumentEntity & MongooseDocument;

@Schema({ timestamps: { created_at: 'created_at', updated_at: 'updated_at' } })
export class DocumentEntity {
  @Prop({ required: true })
  name: string; // Line label, e.g., "Line #2"

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'JobNumber', index: true })
  job_number: mongoose.Types.ObjectId; // Parent JobNumber
}

export const DocumentEntitySchema =
  SchemaFactory.createForClass(DocumentEntity);

// Virtual files based on ref_id + refModel
DocumentEntitySchema.virtual('files', {
  ref: 'FileUpload',
  localField: '_id',
  foreignField: 'ref_id',
  justOne: false,
});

DocumentEntitySchema.set('toObject', { virtuals: true });
DocumentEntitySchema.set('toJSON', { virtuals: true });
