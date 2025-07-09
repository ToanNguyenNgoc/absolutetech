import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as MongooseDocument, Types } from 'mongoose';

export type DocumentEntityDocument = DocumentEntity & MongooseDocument;

@Schema({
  collection: 'documententities',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class DocumentEntity {
  @Prop({ type: String, default: () => crypto.randomUUID() })
  id: string;

  @Prop({ required: true })
  name: string; // Line label, e.g., "Line #2"

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job_number',
    index: true,
  })
  job_number: mongoose.Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'JobNumber', index: true })
  job_number_id?: string;

  @Prop({ type: Date, default: null }) // Add deleted_at field
  deleted_at: Date | null;
}

export const DocumentEntitySchema =
  SchemaFactory.createForClass(DocumentEntity);

DocumentEntitySchema.pre('save', function (next) {
  if (!this.id) this.id = crypto.randomUUID();
  if (this.job_number && !this.job_number_id) {
    this.job_number_id = this.job_number.toString();
  }
  next();
});

// Virtual files based on ref_id + refModel
DocumentEntitySchema.virtual('files', {
  ref: 'FileUpload',
  localField: '_id',
  foreignField: 'ref_id',
  justOne: false,
});

DocumentEntitySchema.set('toObject', { virtuals: true });
DocumentEntitySchema.set('toJSON', { virtuals: true });

DocumentEntitySchema.statics.getSyncColumns = function () {
  return [
    'id',
    'name',
    'job_number_id',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
};
