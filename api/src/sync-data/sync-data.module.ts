import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SyncDataController } from './sync-data.controller';
import { SyncDataService } from './sync-data.services';

import { User, UserSchema } from 'src/user/user.schema';
import {
  UserFinger,
  UserFingerSchema,
} from 'src/user-finger/user-finger.schema';
import { SyncData, SyncDataSchema } from './sync-data.schema';
import {
  JobNumber,
  JobNumberSchema,
} from 'src/job-number/schemas/job-number.schema';
import { Timesheet, TimesheetSchema } from 'src/timesheet/timesheet.schema';
import {
  TimesheetDetail,
  TimesheetDetailSchema,
} from 'src/timesheet-detail/timesheet-detail.schema';
import {
  DocumentEntity,
  DocumentEntitySchema,
} from 'src/job-number/schemas/document.schema';
import {
  FileUpload,
  FileUploadSchema,
} from 'src/job-number/schemas/file-upload.schema';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { SyncDataConsumers } from 'src/consumers/sync-data.consumers';
import {
  BinConfigureModel,
  BinConfigureSchema,
  BinModel,
  BinSchema,
  ClusterModel,
  ClusterSchema,
  IssueCardModel,
  IssueCardSchema,
  IssueModel,
  IssueSchema,
  ProjectRequestModel,
  ProjectRequestSchema,
  ShelfModel,
  ShelfSchema,
  SpareModel,
  SpareSchema,
  TransactionDetailModel,
  TransactionDetailSchema,
  TransactionModel,
  TransactionSchema,
} from 'src/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserFinger.name, schema: UserFingerSchema },
      { name: SyncData.name, schema: SyncDataSchema },
      { name: JobNumber.name, schema: JobNumberSchema },
      { name: Timesheet.name, schema: TimesheetSchema },
      { name: TimesheetDetail.name, schema: TimesheetDetailSchema },
      { name: DocumentEntity.name, schema: DocumentEntitySchema },
      { name: FileUpload.name, schema: FileUploadSchema },
      { name: SpareModel.name, schema: SpareSchema },
      { name: ClusterModel.name, schema: ClusterSchema },
      { name: ShelfModel.name, schema: ShelfSchema },
      { name: BinModel.name, schema: BinSchema },
      { name: BinConfigureModel.name, schema: BinConfigureSchema },
      { name: ProjectRequestModel.name, schema: ProjectRequestSchema },
      { name: IssueModel.name, schema: IssueSchema },
      { name: IssueCardModel.name, schema: IssueCardSchema },
      { name: TransactionModel.name, schema: TransactionSchema },
      { name: TransactionDetailModel.name, schema: TransactionDetailSchema },
    ]),
    BullModule.registerQueue({ name: QUEUE_NAME.sync_data }),
  ],
  controllers: [SyncDataController],
  providers: [SyncDataService, SyncDataConsumers],
  exports: [SyncDataService],
})
export class SyncDataModule {}
