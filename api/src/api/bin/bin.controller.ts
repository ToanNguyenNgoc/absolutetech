import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common';
import {
  BinDocument,
  BinModel,
  ClusterDocument,
  ClusterModel,
  ShelfDocument,
  ShelfModel,
  SpareDocument,
  SpareModel,
} from 'src/models';
import { BinCreate, BinQr } from './bin.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { Utils } from 'src/utils/utils';

@Controller('api/bins')
@Injectable()
export class BinController extends BaseService<BinDocument> {
  constructor(
    @InjectModel(BinModel.name)
    private readonly binModel: Model<BinDocument>,
    @InjectModel(ClusterModel.name)
    private readonly clusterModel: Model<ClusterDocument>,
    @InjectModel(ShelfModel.name)
    private readonly shelfModel: Model<ShelfDocument>,
    @InjectModel(SpareModel.name)
    private readonly spareModel: Model<SpareDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(binModel);
  }
  @Get()
  get(@Query() qr: BinQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      sort: qr.sort,
      filters: Utils.removeNullUn({
        cluster: qr.cluster,
        shelf: qr.shelf,
        status: qr.status,
      }),
      populate: ['cluster', 'shelf', 'spare', 'bin_configs'],
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.findById(id, ['cluster', 'shelf', 'spare', 'bin_configs']);
  }

  @Post()
  async post(@Body() body: BinCreate) {
    return this.create({
      ...body,
      cluster: await this.getCluster(body.cluster),
      shelf: await this.getShelf(body.shelf),
      spare: await this.getSpare(body.spare),
      process_by: await this.getProcess(body.process_by),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.softDelete(id);
  }
  //

  async getCluster(id?: string): Promise<any> {
    if (!id) return null;
    const cluster = await this.clusterModel.findById(id);
    if (!cluster) return null;
    return cluster._id;
  }

  async getShelf(id?: string): Promise<any> {
    if (!id) return null;
    const shelf = await this.shelfModel.findById(id);
    if (!shelf) return null;
    return shelf._id;
  }

  async getSpare(id?: string): Promise<any> {
    if (!id) return null;
    const spare = await this.spareModel.findById(id);
    if (!spare) return null;
    return spare._id;
  }

  async getProcess(id?: string): Promise<any> {
    if (!id) return null;
    const process = await this.userModel.findById(id);
    if (!process) return null;
    return process._id;
  }
}
