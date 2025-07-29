/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Injectable, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { IssuingCreate } from './issuing.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  BinConfigureDocument,
  BinConfigureModel,
  IssueDocument,
  IssueModel,
  TransactionDetailDocument,
  TransactionDetailModel,
  TransactionDocument,
  TransactionModel
} from 'src/models';
import { Model } from 'mongoose';
import {
  JobNumber,
  JobNumberDocument,
} from 'src/job-number/schemas/job-number.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/issuing')
@Injectable()
@UseGuards(JwtAuthGuard)
export class IssuingController {
  constructor(
    @InjectModel(BinConfigureModel.name)
    private readonly binConfigureModel: Model<BinConfigureDocument>,
    @InjectModel(JobNumber.name)
    private readonly jobNumberModel: Model<JobNumberDocument>,
    @InjectModel(IssueModel.name)
    private readonly issueModel: Model<IssueDocument>,
    @InjectModel(TransactionModel.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(TransactionDetailModel.name)
    private readonly transactionDetailModel: Model<TransactionDetailDocument>,
  ) { }
  @Post('')
  async postIssue(@Req() req, @Body() body: IssuingCreate) {
    const jobNumber = (await this.getJobNumber(body.job_number_id)) as any;
    if (!jobNumber || !jobNumber?.project_request?._id) throw new NotFoundException('Job number not found');
    const project_request_id = jobNumber.project_request._id;
    const prev_issues = await this.getPrevIssues(project_request_id, body);
    if (prev_issues.length === 0) throw new NotFoundException('Issues not found');
    const dbIssueMap = new Map<string, any>();
    prev_issues.forEach((i) => dbIssueMap.set(i._id.toString(), i));
    const dataTransactionIssues = [] as Array<{ issue: string, bin_configure: string, quantity: number, changed_qty: number, current_qty: number }>;
    for (const item of body.issues) {
      const dbIssue = dbIssueMap.get(item.id);
      if (!dbIssue) {
        throw new BadRequestException(`Issue ${item.id} not found`);
      }
      if (item.quantity_issue > dbIssue.quantity_request) {
        throw new BadRequestException(
          `quantity_issue (${item.quantity_issue}) exceeds quantity_request (${dbIssue.quantity_request}) for issue ${item.id}`,
        );
      }
      const quantity_issue = item.quantity_issue;
      await this.issueModel.findByIdAndUpdate(item.id, { quantity_request: dbIssue.quantity_request - quantity_issue }).exec();
      const binConfigure = await this.binConfigureModel.findById(dbIssue.bin_configure);
      if (!binConfigure) return;
      await this.binConfigureModel.findByIdAndUpdate(binConfigure._id, { quantity_oh: binConfigure.quantity_oh - quantity_issue });
      dataTransactionIssues.push({
        issue: dbIssue._id,
        bin_configure: dbIssue.bin_configure,
        // quantity: dbIssue.quantity_request,
        // changed_qty: -quantity_issue,
        // current_qty: dbIssue.quantity_request - quantity_issue
        quantity: quantity_issue,
        changed_qty: dbIssue.quantity_request - quantity_issue,
        current_qty: dbIssue.quantity_request
      })
    }
    //[START]: transactions
    const transaction = await this.transactionModel.create({
      type: body.type,
      taker: body.taker_id,
      user: req.user.userId,
      signature_taker: body.signature_taker,
      job_number: jobNumber._id
    })
    await Promise.all(dataTransactionIssues.map(item => this.transactionDetailModel.create({
      transaction: transaction._id,
      ...item
    })))
    return prev_issues;
  }

  async getJobNumber(_id) {
    try {
      const jobNumber = await this.jobNumberModel
        .findOne({ _id })
        .populate('project_request')
        .lean({ virtuals: true });
      return jobNumber;
    } catch (_error) {
      console.log(_error);
      return null
    }
  }

  async getPrevIssues(project_request_id, body) {
    let prev_issues: any[] = [];
    try {
      prev_issues = await this.issueModel
        .find(
          {
            project_request: project_request_id,
            '_id': { $in: body.issues.map(i => i.id) }
          }
        )
    } catch (_error) { }
    return prev_issues
  }
}
