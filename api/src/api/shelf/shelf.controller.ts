/* eslint-disable prettier/prettier */
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
  ClusterDocument,
  ClusterModel,
  ShelfDocument,
  ShelfModel,
} from 'src/models';
import { ShelfCreate, ShelfQr } from './shelf.dto';

@Controller('api/shelfs')
@Injectable()
export class ShelfController extends BaseService<ShelfDocument> {
  constructor(
    @InjectModel(ShelfModel.name)
    private readonly shelfModel: Model<ShelfDocument>,
    @InjectModel(ClusterModel.name)
    private readonly clusterModel: Model<ClusterDocument>,
  ) {
    super(shelfModel);
  }

  @Get()
  get(@Query() qr: ShelfQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      includeDeleted: false,
      sort: qr.sort,
      populate:['cluster']
    });
  }

  @Post()
  async post(@Body() body: ShelfCreate) {
    return this.create({
      ...body,
      cluster: body.cluster ? await this.getCluster(body.cluster) : null,
    });
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() body: ShelfCreate) {
    return this.update(id, {
      ...body,
      cluster: body.cluster ? await this.getCluster(body.cluster) : null,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.softDelete(id);
  }

  async getCluster(id?: string):Promise<any> {
    if (!id) return null;
    const cluster = await this.clusterModel.findById(id);
    if (!cluster) return null;
    return cluster._id;
  }
}
