/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common';
import {
  IssueDocument,
  IssueModel,
  ProjectRequestDocument,
  ProjectRequestModel,
  SpareDocument,
  SpareModel,
} from 'src/models';
import {
  IssueCreate,
  ProjectRequestCreate,
  ProjectRequestQr,
} from './project-request.dto';
import {
  JobNumber,
  JobNumberDocument,
} from 'src/job-number/schemas/job-number.schema';

@Controller('api/project-requests')
@Injectable()
export class ProjectRequestController extends BaseService<ProjectRequestDocument> {
  constructor(
    @InjectModel(ProjectRequestModel.name)
    private readonly projectRequestModel: Model<ProjectRequestDocument>,
    @InjectModel(JobNumber.name)
    private readonly jobNumberModel: Model<JobNumberDocument>,
    @InjectModel(IssueModel.name)
    private readonly issueModel: Model<IssueDocument>,
    @InjectModel(SpareModel.name)
    private readonly spareModel: Model<SpareDocument>,
  ) {
    super(projectRequestModel);
  }

  @Get()
  get(@Query() qr: ProjectRequestQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      populate: ['job_number'],
      sort: qr.sort,
    });
  }

  @Post()
  async post(@Body() body: ProjectRequestCreate) {
    const job_number = await this.getJobNumber(body.job_number);
    //@ts-ignore
    if (job_number.project_request)
      throw new BadRequestException(
        'JobNumber is used an other ProjectRequest',
      );
    return this.create({
      ...body,
      job_number: job_number._id as any,
    });
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() body: ProjectRequestCreate) {
    let job_number: any = undefined;
    if (body.project_name) {
      job_number = await this.getJobNumber(body.job_number);
      if (
        job_number &&
        job_number.project_request &&
        job_number.project_request?._id !== id
      ) {
        throw new BadRequestException(
          'JobNumber is used an other ProjectRequest',
        );
      }
    }
    return this.update(id, { ...body, job_number: job_number?._id });
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.findById(id, ['job_number']);
  }

  //project-request/issue
  @Post('/issues')
  async postIssueItem(@Body() body: IssueCreate) {
    const issue = await this.issueModel.create(body);
    return issue;
  }

  @Get(':project_request_id/issues')
  getIssuesItem(@Param('project_request_id') project_request_id: string) {
    return this.issueModel
      .find({
        project_request: project_request_id,
      })
      .populate([
        'spare',
        {
          path: 'bin_configure',
          populate: { path: 'bin', populate: ['cluster', 'shelf'] },
        },
        'issue_to',
      ]);
  }

  @Get('/issues/:id')
  async getIssueItem(@Param('id') id: string) {
    const issue = await this.issueModel
      .findOne({ _id: id })
      .populate([
        'spare',
        { path: 'bin_configure', populate: { path: 'bin' } },
        'issue_to',
      ]);
    return issue;
  }

  @Put('/issues/:id')
  async putIssueItem(@Param('id') id: string, @Body() body: IssueCreate) {
    return this.issueModel.findByIdAndUpdate(id, body);
  }

  @Delete('/issue/:id')
  async deleteIssueItem(@Param('id') id: string) {
    return this.issueModel.deleteOne({ _id: id });
  }

  //
  async getJobNumber(id): Promise<JobNumberDocument> {
    const job_number = await this.jobNumberModel
      .findOne({ _id: id })
      .populate('project_request');
    if (!job_number) throw new NotFoundException('JobNumber is not exist');
    return job_number;
  }
}
