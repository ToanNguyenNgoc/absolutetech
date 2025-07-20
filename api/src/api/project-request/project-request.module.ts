import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IssueModel,
  IssueSchema,
  ProjectRequestModel,
  ProjectRequestSchema,
  SpareModel,
  SpareSchema,
} from 'src/models';
import { ProjectRequestController } from './project-request.controller';
import {
  JobNumber,
  JobNumberSchema,
} from 'src/job-number/schemas/job-number.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectRequestModel.name, schema: ProjectRequestSchema },
      { name: JobNumber.name, schema: JobNumberSchema },
      { name: IssueModel.name, schema: IssueSchema },
      { name: SpareModel.name, schema: SpareSchema },
    ]),
  ],
  controllers: [ProjectRequestController],
})
export class ProjectRequestModule {}
