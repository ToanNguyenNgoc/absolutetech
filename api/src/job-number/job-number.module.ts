// job-number.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobNumberController } from './job-number.controller';
import { JobNumberService } from './job-number.service';
import { JobNumber, JobNumberSchema } from './schemas/job-number.schema';
import { DocumentEntity, DocumentEntitySchema } from './schemas/document.schema';
import { FileUpload, FileUploadSchema } from './schemas/file-upload.schema';
import { IsUniqueJobNumberConstraint } from './validator/is-unique-job-number.decorator';
import { IsUniqueJobNumberUpdateConstraint } from './validator/is-unique-job-number-update.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobNumber.name, schema: JobNumberSchema },
      { name: DocumentEntity.name, schema: DocumentEntitySchema },
      { name: FileUpload.name, schema: FileUploadSchema },
    ]),
  ],
  controllers: [JobNumberController],
  providers: [JobNumberService, IsUniqueJobNumberConstraint, IsUniqueJobNumberUpdateConstraint],
  exports: [JobNumberService],
})
export class JobNumberModule {}