/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Injectable, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostReturnIssueCard, ReturnIssueCardQr } from './return.dto';
import { paginateWithAggregate } from 'src/common/pagination.util';
import { InjectModel } from '@nestjs/mongoose';
import {
  BinConfigureDocument,
  BinConfigureModel,
  IssueCardDocument,
  IssueCardModel,
  IssueDocument,
  IssueModel,
  ProjectRequestDocument,
  ProjectRequestModel,
  SpareModel,
  TransactionDetailDocument,
  TransactionDetailModel,
  TransactionDocument,
  TransactionModel
} from 'src/models';
import { Model, PipelineStage } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NAME } from 'src/constants';

@Controller('api/return')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class ReturnController {
  constructor(
    @InjectModel(ProjectRequestModel.name)
    private readonly projectRequestModel: Model<ProjectRequestDocument>,
    @InjectModel(IssueCardModel.name)
    private readonly issueCardModel: Model<IssueCardDocument>,
    @InjectModel(IssueModel.name)
    private readonly issueModel: Model<IssueDocument>,
    @InjectModel(BinConfigureModel.name)
    private readonly binConfigureModel: Model<BinConfigureDocument>,
    @InjectModel(TransactionModel.name)
    private readonly transModel: Model<TransactionDocument>,
    @InjectModel(TransactionDetailModel.name)
    private readonly transDetailModel: Model<TransactionDetailDocument>,
  ) { }

  @Get('issue-cards')
  async getIssueCards(@Query() qr: ReturnIssueCardQr) {
    const typesReturnEnable = [
      SpareModel.TYPE.CE,
      SpareModel.TYPE.OTHERS,
      SpareModel.TYPE.PERISHABLE,
      SpareModel.TYPE.TORQUE_WRENCH,
      SpareModel.TYPE.TTC
    ];
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'project_requests',
          localField: 'project_request',
          foreignField: '_id',
          pipeline: [
            { $lookup: { from: 'jobnumbers', localField: 'job_number', foreignField: '_id', as: 'job_number' } },
            { $unwind: { path: '$job_number', preserveNullAndEmptyArrays: true } }
          ],
          as: 'project_request',
        }
      },
      { $match: { project_request: { $ne: null } } },
      { $unwind: { path: '$project_request', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'issues',
          localField: 'issue',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'bin_configures',
                localField: 'bin_configure',
                pipeline: [
                  {
                    $lookup: {
                      from: 'bins', localField: 'bin', foreignField: '_id', pipeline: [
                        { $lookup: { from: 'clusters', localField: 'cluster', foreignField: '_id', as: 'cluster' } },
                        { $unwind: { path: '$cluster', preserveNullAndEmptyArrays: true } },
                        { $lookup: { from: 'shelfs', localField: 'shelf', foreignField: '_id', as: 'shelf' } },
                        { $unwind: { path: '$shelf', preserveNullAndEmptyArrays: true } },
                      ], as: 'bin'
                    }
                  },
                  { $unwind: { path: '$bin', preserveNullAndEmptyArrays: true } },
                  { $lookup: { from: 'spares', localField: 'spare', foreignField: '_id', as: 'spare' } },
                  { $unwind: { path: '$spare', preserveNullAndEmptyArrays: true } }
                ],
                foreignField: '_id', as: 'bin_configure'
              }
            },
            { $unwind: { path: '$bin_configure', preserveNullAndEmptyArrays: true } }
          ],
          as: 'issue'
        }
      },
      { $match: { issue: { $ne: null } } },
      { $unwind: { path: '$issue', preserveNullAndEmptyArrays: true } },
      { $match: { 'issue.bin_configure.spare.type': { $in: typesReturnEnable } } },
      { $match: { quantity: { $gt: 0 } } },
      { $lookup: { from: 'users', localField: 'taker', foreignField: '_id', as: 'taker' } },
      { $unwind: { path: '$taker', preserveNullAndEmptyArrays: true } },
      { $match: { 'taker.employee_id': qr.search } },
    ];
    return paginateWithAggregate({
      model: this.issueCardModel,
      page: qr.page,
      limit: qr.limit,
      pipeline,
      sort: '-createdAt',
    });
  }


  //[HANDLE]: Flow return
  @Post('issue-cards')
  async postReturnIssueCard(@Req() req, @Body() body: PostReturnIssueCard) {
    for (const project_request of body.items) {
      const dataTransactionIssues = [] as Array<{ issue: string, bin_configure: string, quantity: number, changed_qty: number, current_qty: number }>;
      for (const issue_card of project_request.issue_cards) {
        const issue_card_db = await this.issueCardModel.findById(issue_card._id);
        const issue = await this.issueModel.findById(issue_card.issue_id).populate('bin_configure');
        if (!issue_card_db || !issue || !issue.bin_configure) return;
        const prev_issue_card_quantity = issue_card_db.quantity;
        const prev_issue_quantity = issue.quantity_request;
        //@ts-ignore
        const prev_bin_configure_quantity_oh = issue.bin_configure.quantity_oh;
        await this.issueModel.findByIdAndUpdate(issue_card.issue_id, { quantity_request: prev_issue_quantity + issue_card.quantity_return }).exec();
        await this.binConfigureModel.findByIdAndUpdate(issue.bin_configure._id, {
          quantity_oh: prev_bin_configure_quantity_oh + issue_card.quantity_return
        });
        await this.issueCardModel.findByIdAndUpdate(issue_card._id, { quantity: prev_issue_card_quantity - issue_card.quantity_return });
        dataTransactionIssues.push({
          issue: issue_card.issue_id,
          bin_configure: issue.bin_configure._id.toString(),
          current_qty: prev_issue_quantity,
          changed_qty: issue_card.quantity_return,
          quantity: prev_issue_quantity + issue_card.quantity_return
        })
      }
      //[START]: transactions
      const project_request_db = await this.projectRequestModel.findById(project_request.project_request).populate('job_number');
      const transaction = await this.transModel.create({
        type: TransactionModel.TYPE_RETURN,
        taker: body.taker_id,
        user: req.user.userId,
        signature_taker: body.signature_taker,
        job_number: project_request_db?.job_number?._id
      });
      await Promise.all(dataTransactionIssues.map(item => this.transDetailModel.create({
        transaction: transaction._id,
        ...item
      })))
    }
    return { message: 'success' }
  }
}
