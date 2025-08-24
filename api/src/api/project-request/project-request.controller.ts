/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { BaseService } from 'src/common';
import {
  BinConfigureDocument,
  BinConfigureModel,
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
import { LogTransactionService } from 'src/shared/log-transaction/log-transaction.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NAME } from 'src/constants';

@Controller('api/project-requests')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
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
    @InjectModel(BinConfigureModel.name)
    private readonly binConfigureModel: Model<BinConfigureDocument>,
    private readonly logTransaction: LogTransactionService,
  ) {
    super(projectRequestModel);
  }

  @Get()
  get(@Query() qr: ProjectRequestQr) {
    return this.findWithAggregate({
      page: qr.page,
      limit: qr.limit,
      search: qr.search,
      searchFields: ['client', 'job_number.code'],
      pipeline: [
        { $lookup: { from: 'jobnumbers', localField: 'job_number', foreignField: '_id', as: 'job_number' } },
        { $unwind: { path: '$job_number', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'users', localField: 'job_number.assigned_to', foreignField: '_id', as: 'job_number.assigned_to' } },
        { $unwind: { path: '$job_number.assigned_to', preserveNullAndEmptyArrays: true } }
      ],
      sort: qr.sort
    })
  }

  @Post()
  async post(@Body() body: ProjectRequestCreate) {
    const job_number = await this.getJobNumber(body.job_number, body.client);
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
  async put(
    @Request() req,
    @Param('id') id: string,
    @Body() body: ProjectRequestCreate,
  ) {
    let job_number: any = undefined;
    if (body.project_name) {
      job_number = await this.getJobNumber(body.job_number, body.client);
      if (
        job_number &&
        job_number.project_request &&
        String(job_number.project_request?._id) !== id
      ) {
        throw new BadRequestException(
          'JobNumber is used an other ProjectRequest',
        );
      }
    }
    await this.updateAssignedTo(body);
    const response = await this.onConfirmProjectRequest(id, body, req.user);
    if (response) {
      await this.onIssueProjectRequest(id, body);
      return this.update(id, { ...body, job_number: job_number?._id });
    } else {
      return
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.findById(id, ['job_number']);
  }

  //project-request/issue
  @Post('/issues')
  async postIssueItem(@Body() body: IssueCreate) {
    const issue = await this.issueModel.create({ ...body, quantity_origin: body.quantity_request });
    return issue;
  }

  @Get(':project_request_id/issues')
  getIssuesItem(@Param('project_request_id') project_request_id: string) {
    return this.issueModel
      .find({
        project_request: project_request_id,
      })
      .populate([
        {
          path: 'bin_configure',
          match: { deletedAt: null },
          populate: [
            { path: 'bin', populate: ['cluster', 'shelf'] },
            { path: 'spare' },
          ],
        },
        'issue_to',
      ]);
  }

  @Get('/issues/:id')
  async getIssueItem(@Param('id') id: string) {
    const issue = await this.issueModel.findOne({ _id: id }).populate([
      {
        path: 'bin_configure',
        match: { deletedAt: null },
        populate: [
          { path: 'bin', populate: ['cluster', 'shelf'] },
          { path: 'spare' },
        ],
      },
      'issue_to',
    ]);
    return issue;
  }

  @Put('/issues/:id')
  async putIssueItem(@Param('id') id: string, @Body() body: IssueCreate) {
    return this.issueModel.findByIdAndUpdate(id, { ...body, quantity_origin: body.quantity_request }, { new: true }).exec();
  }

  @Delete('/issues/:id')
  async deleteIssueItem(@Param('id') id: string) {
    return this.issueModel.deleteOne({ _id: id }).exec();
  }

  //
  async getJobNumber(id, client): Promise<JobNumberDocument> {
    const job_number = await this.jobNumberModel
      .findByIdAndUpdate(id, { client }, { new: true }).populate('project_request')
    if (!job_number) throw new NotFoundException('JobNumber is not exist');
    return job_number;
  }

  async updateAssignedTo(data: any) {
    try {
      if (!data.site_supervisor) return;
      await this.jobNumberModel
        .findByIdAndUpdate(data.job_number, {
          assigned_to: data.site_supervisor,
          client: data.client,
        })
        .exec();
    } catch (_err) { }
  }

  async onConfirmProjectRequest(
    id: string,
    body: ProjectRequestCreate,
    user: any,
  ) {
    if (body.status !== ProjectRequestModel.PJ_STATUS_IN_PROGRESS) return;
    const projectRequest = await this.projectRequestModel.findById(id);
    if (!projectRequest) return;
    if (projectRequest.confirmed_by) throw new BadRequestException('Project request is confirmed');
    // if ((!projectRequest.status || projectRequest.status === ProjectRequestModel.PJ_STATUS_NEW)) {
    //   return this.projectRequestModel.findByIdAndUpdate(id, {
    //     confirmed_by: user.userId,
    //     status: ProjectRequestModel.PJ_STATUS_IN_PROGRESS,
    //   });
    // }
    return this.projectRequestModel.findByIdAndUpdate(id, {
      confirmed_by: user.userId,
      status: ProjectRequestModel.PJ_STATUS_IN_PROGRESS,
    });
  }

  async onIssueProjectRequest(id: string, body: ProjectRequestCreate) {
    if (body.status !== ProjectRequestModel.PJ_STATUS_ISSUE) return;
    const projectRequest = await this.projectRequestModel.findById(id);
    if (!projectRequest) return;
    if (!projectRequest.confirmed_by) throw new BadRequestException('Please confirm project request');
    if (projectRequest.status === ProjectRequestModel.PJ_STATUS_ISSUE) throw new BadRequestException('Project request is issued');
    const issues = await this.issueModel.find({ project_request: id });
    await Promise.all(issues.map(async (issue) => {
      const binConfigure = await this.binConfigureModel.findById(issue.bin_configure);
      if (!binConfigure) return;
      return this.binConfigureModel.findByIdAndUpdate(binConfigure._id, {
        quantity_oh: binConfigure.quantity_oh - issue.quantity_request
      })
    }));
    return this.projectRequestModel
      .findByIdAndUpdate(id, {
        status: ProjectRequestModel.PJ_STATUS_ISSUE,
      })
      .exec();
  }
}
