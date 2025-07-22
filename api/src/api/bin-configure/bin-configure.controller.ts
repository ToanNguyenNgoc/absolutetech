/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common';
import {
  BinConfigureDocument,
  BinConfigureModel,
  BinDocument,
  BinModel,
  SpareDocument,
  SpareModel,
} from 'src/models';
import { BinConfigureCreate, BinConfigureQr } from './bin-configure.dto';
import { Utils } from 'src/utils/utils';

@Controller('api/bin-configures')
@Injectable()
export class BinConfigureController extends BaseService<BinConfigureDocument> {
  constructor(
    @InjectModel(BinConfigureModel.name)
    private readonly binConfigureModel: Model<BinConfigureDocument>,
    @InjectModel(BinModel.name)
    private readonly binModel: Model<BinDocument>,
    @InjectModel(SpareModel.name)
    private readonly spareModel: Model<SpareDocument>,
  ) {
    super(binConfigureModel);
  }

  @Get()
  get(@Query() qr: BinConfigureQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      sort: qr.sort,
      search: qr.search,
      searchFields: ['description', 'batch_no', 'serial_no', 'rfid'],
      filters: Utils.removeNullUn({
        bin: qr.bin,
      }),
      populate: ['spare', { path: 'bin', populate: ['cluster', 'shelf'] }],
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.findById(id, [
      'spare',
      { path: 'bin', populate: ['cluster', 'shelf'] },
    ]);
  }

  @Post()
  async post(@Body() body: BinConfigureCreate) {
    const bin_configure = await this.create({
      ...body,
      bin: await this.getBin(body.bin),
      spare: await this.getSpare(body.spare),
      quantity_org: body.quantity_oh,
    });
    return this.getOne(bin_configure._id as any);
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() body: BinConfigureCreate) {
    await this.update(id, {
      ...body,
      bin: await this.getBin(body.bin),
      spare: await this.getSpare(body.spare),
    });
    return this.getOne(id);
  }

  @Delete(':id')
  deleteOne(@Param(':id') id: string) {
    return this.delete(id);
  }
  //
  async getBin(id?: string): Promise<any> {
    if (!id) return undefined;
    try {
      const bin = await this.binModel.findById(id);
      return bin?._id;
    } catch (_error) {
      return undefined;
    }
  }

  async getSpare(id?: string): Promise<any> {
    if (!id) return undefined;
    try {
      const spare = await this.spareModel.findById(id);
      return spare?._id;
    } catch (_error) {
      return undefined;
    }
  }
}
