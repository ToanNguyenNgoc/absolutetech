// job-number.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobNumber, JobNumberDocument } from './schemas/job-number.schema';
import { CreateJobNumberDto } from './dto/create-job-number.dto';
import { paginate } from 'src/common/pagination.util';
import { FileUpload, FileUploadDocument } from './schemas/file-upload.schema';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  DocumentEntity,
  DocumentEntityDocument,
} from './schemas/document.schema';

@Injectable()
export class JobNumberService {
  constructor(
    @InjectModel(JobNumber.name)
    private jobNumberModel: Model<JobNumberDocument>,
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUploadDocument>,
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentEntityDocument>,
  ) {}

  async create(dto: CreateJobNumberDto): Promise<JobNumberDocument> {
    try {
      const { documents, ...jobData } = dto;

      const jobNumber = await this.jobNumberModel.create(jobData);

      if (documents?.length) {
        for (const doc of documents) {
          const newDocument = await this.documentModel.create({
            name: doc.name,
            jobNumber: jobNumber._id,
          });

          if (doc.fileIds?.length) {
            await this.fileUploadModel.updateMany(
              { _id: { $in: doc.fileIds } },
              {
                refId: newDocument._id,
                refModel: 'DocumentEntity',
                isTemp: false,
              },
            );
          }
        }
      }

      return jobNumber;
    } catch (error) {
      console.error('❌ Error creating JobNumber:', error);
      throw new Error('Failed to create JobNumber');
    }
  }

  async findAllPaginated(page = 1, limit = 10) {
    return paginate(
      this.jobNumberModel,
      page,
      limit,
      {},
      {},
      {
        populate: [
          'assignedTo',
          'createdBy',
          {
            path: 'documents',
            populate: {
              path: 'files',
              match: { refModel: 'DocumentEntity' },
            },
          },
        ],
      },
    );
  }

  async handleFileUpload(file: Express.Multer.File) {
    const newFile = new this.fileUploadModel({
      name: file.originalname,
      url: `uploads/job-files/${file.filename}`,
      size: file.size,
      extension: path.extname(file.originalname).replace('.', ''),
      mimeType: file.mimetype,
      isTemp: true,
    });
    return await newFile.save();
  }

  async deleteJobNumber(id: string): Promise<{ message: string }> {
    const jobNumber = await this.jobNumberModel.findById(id);
    if (!jobNumber) {
      throw new NotFoundException('Job Number not found');
    }

    const documents = await this.documentModel.find({ jobNumber: id }).exec();
    const documentIds = documents.map((doc) => doc._id);

    const files = await this.fileUploadModel
      .find({
        refId: { $in: documentIds },
        refModel: 'DocumentEntity',
      })
      .exec();

    for (const file of files) {
      const filePath = path.join(process.cwd(), file.url);
      console.log('🛣️ Attempting to delete:', filePath);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(`⚠️ Could not delete file ${filePath}:`, err.message);
      }
    }

    await this.fileUploadModel.deleteMany({
      refId: { $in: documentIds },
      refModel: 'DocumentEntity',
    });
    await this.documentModel.deleteMany({ jobNumber: id });

    await this.jobNumberModel.findByIdAndDelete(id);

    return { message: 'Job Number deleted successfully' };
  }
}
