import { Module } from '@nestjs/common';
import { MediaController, UploadController } from './media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FileUpload,
  FileUploadSchema,
} from 'src/job-number/schemas/file-upload.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileUpload.name, schema: FileUploadSchema },
    ]),
  ],
  controllers: [MediaController, UploadController],
})
export class MediaModule {}
