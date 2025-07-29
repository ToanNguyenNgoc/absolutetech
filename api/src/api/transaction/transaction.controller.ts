/* eslint-disable prettier/prettier */
import { Controller, Get, Injectable, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BaseService } from 'src/common';
import { TransactionDocument, TransactionModel } from 'src/models';
import { TransactionQr } from './transaction.dto';

@Controller('api/transactions')
@Injectable()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionController extends BaseService<TransactionDocument> {
  constructor(
    @InjectModel(TransactionModel.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {
    super(transactionModel);
  }

  @Get()
  async get(@Query() qr: TransactionQr) {
    const pipeline: PipelineStage[] = [
      { $lookup: { from: 'users', localField: 'taker', foreignField: '_id', as: 'taker', pipeline: [{ $project: { password: 0 } }] } },
      { $unwind: { path: '$taker', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'jobnumbers', localField: 'job_number', foreignField: '_id', as: 'job_number' } },
      { $unwind: { path: '$job_number', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'transaction_details',
          let: { transactionId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$transaction', '$$transactionId'] } } },
            {
              $lookup: {
                from: 'issues',
                localField: 'issue',
                foreignField: '_id',
                pipeline: [
                  {
                    $lookup: {
                      from: 'bin_configures', localField: 'bin_configure', foreignField: '_id', as: 'bin_configure',
                      pipeline: [
                        { $lookup: { from: 'spares', localField: 'spare', foreignField: '_id', as: 'spare' } },
                        { $unwind: { path: '$spare', preserveNullAndEmptyArrays: true } },
                      ]
                    }
                  },
                  { $unwind: { path: '$bin_configure', preserveNullAndEmptyArrays: true } },
                ],
                as: 'issue'
              }
            },
            { $unwind: { path: '$issue', preserveNullAndEmptyArrays: true } },
          ],
          as: 'transaction_details'
        }
      },
      { $project: { signature_taker: 0 } }
    ];
    if (qr.types && qr.types?.trim()?.split('|').length > 0) {
      pipeline.push({
        $match: { type: { $in: qr.types?.trim()?.split('|') } }
      })
    }
    if (qr.start_date || qr.end_date) {
      const dateFilter: any = {};
      if (qr.start_date) {
        dateFilter.$gte = new Date(qr.start_date);
      }
      if (qr.end_date) {
        const end = new Date(qr.end_date);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      pipeline.push({ $match: { createdAt: dateFilter } });
    }
    return this.findWithAggregate({
      page: qr.page,
      limit: qr.limit,
      pipeline,
      search: qr.search,
      searchFields: ['job_number.code', 'transaction_details.issue.bin_configure.spare.name'],
      sort: qr.sort,
    });
  }
}
