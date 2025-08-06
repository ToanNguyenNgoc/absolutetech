/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Injectable, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import {
  BinConfigureDocument,
  BinConfigureModel,
  SpareModel,
  TransactionDetailDocument,
  TransactionDetailModel,
  TransactionDocument,
  TransactionModel
} from 'src/models';
import { ReplenishBinConfigureDto, ReplenishBinConfigureQr } from './replenish.dto';
import { paginateWithAggregate } from 'src/common/pagination.util';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NAME } from 'src/constants';

@Controller('api/replenish')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
@Injectable()
export class ReplenishController {
  constructor(
    @InjectModel(BinConfigureModel.name)
    private readonly binConfigureModel: Model<BinConfigureDocument>,
    @InjectModel(TransactionModel.name)
    private readonly transModel: Model<TransactionDocument>,
    @InjectModel(TransactionDetailModel.name)
    private readonly transDetailModel: Model<TransactionDetailDocument>,
  ) { }

  @Get('bin-configures')
  async getReplenishBinConfigure(@Query() qr: ReplenishBinConfigureQr) {
    const typesReplenishEnable = [
      SpareModel.TYPE.CONSUMABLE
    ];
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'bins', localField: 'bin', pipeline:
            [
              { $lookup: { from: 'clusters', localField: 'cluster', foreignField: '_id', as: 'cluster' } },
              { $unwind: { path: '$cluster', preserveNullAndEmptyArrays: true } },
              { $lookup: { from: 'shelfs', localField: 'shelf', foreignField: '_id', as: 'shelf' } },
              { $unwind: { path: '$shelf', preserveNullAndEmptyArrays: true } },
            ],
          foreignField: '_id', as: 'bin'
        }
      },
      { $unwind: { path: '$bin', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'spares', localField: 'spare', foreignField: '_id', as: 'spare' } },
      { $unwind: { path: '$spare', preserveNullAndEmptyArrays: true } },
      { $match: { 'spare.deletedAt': null } },
      { $match: { 'spare.type': { $in: typesReplenishEnable } } },
      { $match: { 'spare': { $ne: null } } },
    ];
    return paginateWithAggregate({
      model: this.binConfigureModel,
      page: qr.page,
      limit: qr.limit,
      pipeline,
      search: qr.search,
      searchFields: ['spare.name', 'spare.material_no', 'spare.part_no'],
      sort: qr.sort
    });
  }

  @Post('bin-configures')
  async postReplenishBinConfigure(@Req() req, @Body() body: ReplenishBinConfigureDto) {
    const dataTransactions = [] as Array<{ bin_configure: string, quantity: number, changed_qty: number, current_qty: number }>;
    for (const bin_configure of body.bin_configures) {
      const bin_configure_db = await this.binConfigureModel.findById(bin_configure.bin_configure_id);
      if (!bin_configure_db) return;
      const quantity_replenish = bin_configure.quantity_replenish;
      const prev_bin_configure_quantity_oh = bin_configure_db.quantity_oh;
      const new_bin_configure_quantity_oh = prev_bin_configure_quantity_oh + quantity_replenish
      await this.binConfigureModel.findOneAndUpdate(bin_configure_db._id, {
        quantity_oh: new_bin_configure_quantity_oh
      });
      dataTransactions.push({
        bin_configure: bin_configure.bin_configure_id,
        current_qty: prev_bin_configure_quantity_oh,
        quantity: quantity_replenish,
        changed_qty: new_bin_configure_quantity_oh
      })
    }
    //[START]: transactions
    const transaction = await this.transModel.create({
      type: TransactionModel.TYPE_REPLENISH,
      taker: body.taker_id,
      user: req.user.userId,
      signature_taker: body.signature_taker,
    });
    await Promise.all(dataTransactions.map(item => this.transDetailModel.create({
      transaction: transaction._id,
      ...item
    })))
    return { message: 'success' }
  }
}
