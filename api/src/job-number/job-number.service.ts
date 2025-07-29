/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobNumber, JobNumberDocument } from './schemas/job-number.schema';
import { CreateJobNumberDto } from './dto/create-job-number.dto';
import { FileUpload, FileUploadDocument } from './schemas/file-upload.schema';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  DocumentEntity,
  DocumentEntityDocument,
} from './schemas/document.schema';
import { UpdateJobNumberDto } from './dto/update-job-number.dto';
import { BaseService } from 'src/common';
import { JobNumberQr } from './dto/job-number-query.dto';

@Injectable()
export class JobNumberService extends BaseService<JobNumberDocument> {
  constructor(
    @InjectModel(JobNumber.name)
    private jobNumberModel: Model<JobNumberDocument>,
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUploadDocument>,
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentEntityDocument>,
  ) {
    super(jobNumberModel);
  }

  async createOne(dto: CreateJobNumberDto): Promise<JobNumberDocument> {
    try {
      const { documents, est_start_date, est_end_date, ...jobData } = dto;

      const createdAta = {
        ...jobData,
        est_start_date: est_start_date ? new Date(est_start_date) : undefined,
        est_end_date: est_end_date ? new Date(est_end_date) : undefined,
      };

      const jobNumber = await this.jobNumberModel.create(createdAta);

      if (documents?.length) {
        for (const doc of documents) {
          const newDocument = await this.documentModel.create({
            name: doc.name,
            job_number: jobNumber._id,
          });
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

      return jobNumber;
    } catch (error) {
      console.error('❌ Error creating JobNumber:', error);
      throw new Error('Failed to create JobNumber');
    }
  }

  async getDetailById(id: string, query: any) {
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
    let duplicate;
    if (query?.gen_duplicate) {
      duplicate = await this.genDuplicateData(jobNumber);
    }
    return {
      ...jobNumber.toObject?.({ virtuals: true }) ?? jobNumber,
      duplicate,
    };
  }

  async findAllPaginated(qr: JobNumberQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      search: qr.search,
      searchFields: ['code', 'client', 'project'],
      populate: [
        'assigned_to',
        'created_by',
        'est_start_date',
        'est_end_date',
        'project_request',
        {
          path: 'documents',
          populate: {
            path: 'files',
            match: { ref_model: 'DocumentEntity' },
          },
        },
      ],
      sort: qr.sort,
    });
  }

  async handleFileUpload(file: Express.Multer.File) {
    console.log('RUN', file);
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

  async updateOne(id: string, dto: UpdateJobNumberDto) {
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

  async genDuplicateData(jobNumber) {
    const prefixCode = (jobNumber.code || 'JNCODE').split('-')[0];
    let duplicate_code = `${prefixCode}-${new Date().getTime()}`
    try {
      const jobNumbers = await (this.jobNumberModel.find({ code: { $regex: `${prefixCode}-` } }).select(['code']));
      const codes = jobNumbers.map(i => ({ code: i.code, index: Number(i.code.split('-')[1] || 0) })).sort((a, b) => b.index - a.index);
      const lastIndex = codes[0]?.index || 0;
      duplicate_code = `${prefixCode}-${lastIndex + 1}`
    } catch (_error) { }
    const duplicate_documents: any[] = [];
    const documents = jobNumber?.documents || [];
    for (let i = 0; i < documents.length; i++) {
      const files = [] as any;
      const origin_files = documents[i].files || [];
      for (let iFile = 0; iFile < origin_files.length; iFile++) {
        try {
          const file = await this.copyFileRecordAndStorage(origin_files[iFile]);
          files.push(file);
        } catch (error) { }
      }
      duplicate_documents.push({
        name: documents[i].name,
        files,
      })
    }
    return {
      duplicate_code,
      duplicate_documents
    }
  }

  async copyFileRecordAndStorage(originalFile: any) {
    const newFileRecord = await this.fileUploadModel.create({
      name: originalFile.name,
      url: originalFile.url,
      original_url: originalFile.original_url,
      size: originalFile.size,
      extension: originalFile.extension,
      mime_type: originalFile.mime_type,
      type: originalFile.type,
      is_deleted: false,
      is_temp: false,
    });
    return newFileRecord;
  }

}
