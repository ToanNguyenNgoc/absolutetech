/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { UpdateJobNumberDto } from './dto/update-job-number.dto';

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
      const { documents, est_start_date, est_end_date, ...jobData } = dto;

      const created_ata = {
        ...jobData,
        est_start_date: est_start_date ? new Date(est_start_date) : undefined,
        est_end_date: est_end_date ? new Date(est_end_date) : undefined,
      };

      const jobNumber = await this.jobNumberModel.create(created_ata);

      if (documents?.length) {
        for (const doc of documents) {
          const newDocument = await this.documentModel.create({
            name: doc.name,
            job_number: jobNumber._id,
          });

          if (doc.fileIds?.length) {
            await this.fileUploadModel.updateMany(
              { _id: { $in: doc.fileIds } },
              {
                ref_id: newDocument._id,
                ref_model: 'DocumentEntity',
                is_temp: false,
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

  async getDetailById(id: string) {
    const jobNumber = await this.jobNumberModel
      .findById(id)
      .populate('assigned_to')
      .populate('created_by')
      .populate({
        path: 'documents',
        populate: {
          path: 'files',
          match: { ref_model: 'DocumentEntity' },
        },
      })
      .exec();

    if (!jobNumber) {
      throw new NotFoundException('Job Number not found');
    }
    return jobNumber;
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
          'assigned_to',
          'created_by',
          'est_start_date',
          'est_end_date',
          {
            path: 'documents',
            populate: {
              path: 'files',
              match: { ref_model: 'DocumentEntity' },
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
      mime_type: file.mimetype,
      is_temp: true,
    });
    return await newFile.save();
  }

  async deleteJobNumber(id: string): Promise<{ message: string }> {
    const jobNumber = await this.jobNumberModel.findById(id);
    if (!jobNumber) {
      throw new NotFoundException('Job Number not found');
    }

    const documents = await this.documentModel.find({ job_number: id }).exec();
    const documentIds = documents.map((doc) => doc._id);

    const files = await this.fileUploadModel
      .find({
        ref_id: { $in: documentIds },
        ref_model: 'DocumentEntity',
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
      ref_id: { $in: documentIds },
      ref_model: 'DocumentEntity',
    });
    await this.documentModel.deleteMany({ job_number: id });

    await this.jobNumberModel.findByIdAndDelete(id);

    return { message: 'Job Number deleted successfully' };
  }

  async update(id: string, dto: UpdateJobNumberDto) {
    const job = await this.jobNumberModel.findById(id);
    if (!job) throw new NotFoundException('Job Number not found');

    // Update JobNumber
    await this.jobNumberModel.findByIdAndUpdate(id, {
      code: dto.code,
      project: dto.project,
      assigned_to: dto.assigned_to,
      created_by: dto.created_by,
      status: dto.status ?? 'open',
    });

    // --- STEP 1: Xác định những document nào cần xóa ---
    const oldDocs = await this.documentModel.find({ job_number: id }).lean();
    const oldDocIds = oldDocs.map((d) => d._id.toString());
    const incomingDocIds = (dto.documents ?? [])
      .filter((d) => d.documentId)
      .map((d) => d.documentId);
    const docIdsToDelete = oldDocIds.filter(
      (id) => !incomingDocIds.includes(id),
    );

    // --- STEP 2: Xóa file & document bị loại khỏi danh sách ---
    if (docIdsToDelete.length > 0) {
      const filesToDelete = await this.fileUploadModel
        .find({
          ref_id: { $in: docIdsToDelete },
          ref_model: 'DocumentEntity',
        })
        .lean();

      for (const file of filesToDelete) {
        const filePath = path.join(process.cwd(), file.url);
        try {
          await fs.unlink(filePath);
        } catch (e) {
          console.warn(`⚠️ File not found to delete: ${filePath}`);
        }
      }
      await this.fileUploadModel.deleteMany({
        ref_id: { $in: docIdsToDelete },
        ref_model: 'DocumentEntity',
      });
      await this.documentModel.deleteMany({ _id: { $in: docIdsToDelete } });
    }

    // --- STEP 3: Update hoặc tạo mới document ---
    for (const doc of dto.documents ?? []) {
      if (doc.documentId) {
        // Existing document
        await this.documentModel.findByIdAndUpdate(doc.documentId, {
          name: doc.name,
        });

        // Sync fileIds: delete removed ones, update remaining
        const existingFiles = await this.fileUploadModel
          .find({ ref_id: doc.documentId, ref_model: 'DocumentEntity' })
          .exec();
        const incomingIds = doc.fileIds ?? [];

        const toDelete = existingFiles.filter(
          (file: any) => !incomingIds.includes(file._id.toString()),
        );

        for (const file of toDelete) {
          const filePath = path.join(process.cwd(), file.url);
          try {
            await fs.unlink(filePath);
          } catch (e) {
            console.warn(`⚠️ File not found to delete: ${filePath}`);
          }
        }

        await this.fileUploadModel.deleteMany({
          _id: { $in: toDelete.map((f) => f._id) },
        });

        await this.fileUploadModel.updateMany(
          { _id: { $in: incomingIds } },
          {
            ref_id: doc.documentId,
            ref_model: 'DocumentEntity',
            is_temp: false,
          },
        );
      } else {
        // New document
        const newDoc = await this.documentModel.create({
          name: doc.name,
          job_number: id,
        });

        if (doc.fileIds?.length) {
          await this.fileUploadModel.updateMany(
            { _id: { $in: doc.fileIds } },
            {
              ref_id: newDoc._id,
              ref_model: 'DocumentEntity',
              is_temp: false,
            },
          );
        }
      }
    }

    return { message: 'Job Number updated successfully' };
  }
}
