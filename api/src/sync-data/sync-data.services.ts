/* eslint-disable */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Model, Mongoose } from 'mongoose';
import SqlString from 'sqlstring';
import { UserFinger } from 'src/user-finger/user-finger.schema';
import { User, UserDocument } from 'src/user/user.schema';
import { DateUtil } from 'src/utils/date.util';
import { FetchForTabletDto } from './dto/fetch-for-tablet.dto';
import { SyncDataCreateDto } from './dto/sync-data-create.dto';
import { SyncFromDeviceDto } from './dto/sync-from-device.dto';
import { SyncData } from './sync-data.schema';
import { JobNumber } from 'src/job-number/schemas/job-number.schema';
import { Timesheet } from 'src/timesheet/timesheet.schema';
import { TimesheetDetail } from 'src/timesheet-detail/timesheet-detail.schema';

import {
  DocumentEntity,
  DocumentEntityDocument,
} from 'src/job-number/schemas/document.schema';
import {
  FileUpload,
  FileUploadDocument,
} from 'src/job-number/schemas/file-upload.schema';
import {
  BinConfigureModel,
  BinModel,
  ClusterModel,
  IssueCardModel,
  IssueModel,
  ProjectRequestModel,
  ShelfModel,
  SpareModel,
  TransactionDetailModel,
  TransactionModel,
} from 'src/models';

interface SyncableModel<T> extends Model<T> {
  getSyncColumns: () => string[];
}

@Injectable()
export class SyncDataService {
  private tableMap: Record<string, Model<any>>;

  constructor(
    @InjectModel(SyncData.name)
    private syncDataModel: Model<SyncData>,
    @InjectModel(User.name)
    private userModel: SyncableModel<UserDocument>,
    @InjectModel(UserFinger.name)
    private userFingerModel: SyncableModel<UserFinger>,
    @InjectModel(JobNumber.name)
    private jobNumberModule: SyncableModel<JobNumber>,
    @InjectModel(Timesheet.name)
    private timesheetModel: SyncableModel<Timesheet>,
    @InjectModel(TimesheetDetail.name)
    private timesheetDetailModel: SyncableModel<TimesheetDetail>,
    @InjectModel(DocumentEntity.name)
    private documentModal: SyncableModel<DocumentEntityDocument>,
    @InjectModel(FileUpload.name)
    private fileUpload: SyncableModel<FileUploadDocument>,
    @InjectModel(SpareModel.name)
    private spareModel: SyncableModel<SpareModel>,
    @InjectModel(ClusterModel.name)
    private clusterModel: SyncableModel<ClusterModel>,
    @InjectModel(ShelfModel.name)
    private shelfModel: SyncableModel<ShelfModel>,
    @InjectModel(BinModel.name)
    private binModel: SyncableModel<BinModel>,
    @InjectModel(BinConfigureModel.name)
    private binConfigureModel: SyncableModel<BinConfigureModel>,
    @InjectModel(ProjectRequestModel.name)
    private projectRequestModel: SyncableModel<ProjectRequestModel>,
    @InjectModel(IssueModel.name)
    private issueModel: SyncableModel<IssueModel>,

    @InjectModel(IssueCardModel.name)
    private issueCardModel: SyncableModel<IssueCardModel>,

    @InjectModel(TransactionModel.name)
    private transactionModel: SyncableModel<TransactionModel>,
    @InjectModel(TransactionDetailModel.name)
    private transactionDetailModel: SyncableModel<TransactionDetailModel>,
  ) {
    this.tableMap = {
      timesheet: this.timesheetModel,
      timesheetDetail: this.timesheetDetailModel,
      jobNumber: this.jobNumberModule,
      userFinger: this.userFingerModel,
      user: this.userModel,
      document: this.documentModal,
      fileUpload: this.fileUpload,
      spare: this.spareModel,
      cluster: this.clusterModel,
      shelf: this.shelfModel,
      bin: this.binModel,
      binConfigure: this.binConfigureModel,
      projectRequest: this.projectRequestModel,
      issues: this.issueModel,
      issueCard: this.issueCardModel,
      transaction: this.transactionModel,
      transactionDetail: this.transactionDetailModel,
    };
  }

  async fetchForTablet(fetchForTabletDto: FetchForTabletDto) {
    try {
      const models = [
        { model: this.userModel, table: 'users' },
        { model: this.userFingerModel, table: 'user_fingers' },
        { model: this.jobNumberModule, table: 'jobnumbers' },
        { model: this.timesheetModel, table: 'timesheets' },
        { model: this.timesheetDetailModel, table: 'timesheet_details' },
        { model: this.documentModal, table: 'documententities' },
        { model: this.fileUpload, table: 'fileuploads' },

        { model: this.spareModel, table: 'spares' },
        { model: this.clusterModel, table: 'clusters' },
        { model: this.shelfModel, table: 'shelfs' },
        { model: this.binModel, table: 'bins' },
        { model: this.binConfigureModel, table: 'bin_configures' },
        { model: this.projectRequestModel, table: 'project_requests' },
        { model: this.issueModel, table: 'issues' },
        { model: this.issueCardModel, table: 'issue_cards' },
        { model: this.transactionModel, table: 'transactions' },
        { model: this.transactionDetailModel, table: 'transaction_details' },
      ];

      const scriptExecute = await this.fetchData(fetchForTabletDto, models);
      const timeFetch = DateUtil.currentDateString();

      if (fetchForTabletDto.timestamp_fetch) {
        await this.insertNewSyncData({
          device_id: fetchForTabletDto.device_id,
          timestamp_fetch: timeFetch,
          data: JSON.stringify(scriptExecute),
        });
      }
      return {
        code: true,
        scripts: scriptExecute,
        timestamp_fetch: timeFetch,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch data: ${error.message}`);
    }
  }

  async syncFromDevice(data: SyncFromDeviceDto) {
    try {
      console.log('data.tables', data.tables);

      const timeSync = DateUtil.currentDateString();
      for (const [tableName, rows] of Object.entries(data.tables)) {
        const model = this.tableMap[tableName];
        // console.log('tableName', tableName);
        // console.log('rows', rows);
        // console.log('model', model);
        if (model && rows.length) {
          const mapsTrans = rows.map((row) => {
            const updatedRow: any = {};
            for (const [key, value] of Object.entries(row)) {
              if (key.endsWith('_id') && key != 'ref_id') {
                updatedRow[key.replace(/_id$/, '')] = value;
              } else {
                updatedRow[key] = value;
              }
            }
            // Luôn set _id = row.id để làm upsert
            updatedRow._id = row.id;
            // console.log('updatedRow', updatedRow);
            // console.log('tableName', tableName);
            // console.log('model', model);

            return {
              updateOne: {
                filter: { _id: row.id },
                update: { $set: updatedRow },
                upsert: true,
              },
            };
          });

          try {
            await model.bulkWrite(mapsTrans);
          } catch (error) {
            console.log('errorerrorerror', error);
          }
        }
      }
      console.log({
        code: true,
        timestamp_fetch: timeSync,
      });
      return {
        code: true,
        timestamp_fetch: timeSync,
      };
    } catch (error) {
      console.log('syncFromDevice', error);

      throw new BadRequestException(
        `Failed to sync from device: ${error.message}`,
      );
    }
  }

  async insertNewSyncData(data: SyncDataCreateDto) {
    try {
      await this.syncDataModel.create(data);
    } catch (error) {
      throw new Error(`Failed to insert sync data: ${error.message}`);
    }
  }

  async fetchData(
    fetchForTabletDto: FetchForTabletDto,
    models: { model: SyncableModel<any>; table: string }[],
  ) {
    try {
      const lastTimestamp =
        fetchForTabletDto.timestamp_fetch || '1970-01-01 00:00:00';
      if (
        fetchForTabletDto.timestamp_fetch &&
        isNaN(new Date(lastTimestamp).getTime())
      ) {
        throw new Error('Invalid timestamp format');
      }
      const isFetchAll = !fetchForTabletDto.timestamp_fetch;
      const result = {};
      for (const { model, table } of models) {
        const syncColumns = model.getSyncColumns?.() || [];
        if (!syncColumns.length) {
          console.warn(`No sync columns defined for table ${table}`);
          continue;
        }
        const query = isFetchAll
          ? { updatedAt: { $gte: new Date(lastTimestamp) } }
          : { updatedAt: { $gte: new Date(lastTimestamp) }, deletedAt: null };
        const documents = await model
          .find(query)
          .lean({ virtuals: true })
          .exec();
        result[table] = documents.map((doc) => {
          const filtered = {};
          for (const col of syncColumns) {
            filtered[col] = doc[col];
          }
          return filtered;
        });
      }
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
