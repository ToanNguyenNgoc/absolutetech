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
import { Utils } from 'src/utils/utils';
import { ObjectId } from 'mongodb';
import { omit } from 'lodash';

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
  async get(@Query() qr: ShelfQr) {
    let queryMatch = Utils.cleanQuery(omit(qr, ['page', 'limit', 'sort'])) as any;
    if (qr.cluster) {
      delete queryMatch.cluster
      queryMatch = { ...queryMatch, 'cluster._id': new ObjectId(qr.cluster) }
    }
    return this.findWithAggregate({
      page: qr.page,
      limit: qr.limit,
      pipeline: [
        { $lookup: { from: 'clusters', localField: 'cluster', foreignField: '_id', as: 'cluster' } },
        { $unwind: { path: '$cluster', preserveNullAndEmptyArrays: true } },
        { $match: queryMatch }
      ],
      sort: qr.sort
    })
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

  async getCluster(id?: string): Promise<any> {
    if (!id) return null;
    const cluster = await this.clusterModel.findById(id);
    if (!cluster) return null;
    return cluster._id;
  }
}
