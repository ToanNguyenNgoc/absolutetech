import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as MongooseDocument } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type DocumentEntityDocument = DocumentEntity & MongooseDocument;

@Schema({
  collection: 'documententities',
  timestamps: true,
})
export class DocumentEntity {
  @Prop({ required: true })
  name: string; // Line label, e.g., "Line #2"

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job_number',
    index: true,
  })
  job_number: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null }) // Add deleted_at field
  deletedAt?: Date;
}

export const DocumentEntitySchema =
  SchemaFactory.createForClass(DocumentEntity);

DocumentEntitySchema.virtual('id').get(function () {
  return this._id.toString();
});
DocumentEntitySchema.virtual('job_number_id').get(function () {
  return this.job_number._id.toString();
});

DocumentEntitySchema.plugin(mongooseLeanVirtuals);

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
  return ['id', 'name', 'job_number_id', 'createdAt', 'updatedAt', 'deletedAt'];
};
