import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BinConfigureModel,
  BinConfigureSchema,
  IssueModel,
  IssueSchema,
  ProjectRequestModel,
  ProjectRequestSchema,
  SpareModel,
  SpareSchema,
} from 'src/models';
import {
  JobNumber,
  JobNumberSchema,
} from 'src/job-number/schemas/job-number.schema';
import { ProjectRequestController } from './project-request.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectRequestModel.name, schema: ProjectRequestSchema },
      { name: JobNumber.name, schema: JobNumberSchema },
      { name: IssueModel.name, schema: IssueSchema },
      { name: SpareModel.name, schema: SpareSchema },
      { name: BinConfigureModel.name, schema: BinConfigureSchema },
    ]),
  ],
  controllers: [ProjectRequestController],
})
export class ProjectRequestModule {}
