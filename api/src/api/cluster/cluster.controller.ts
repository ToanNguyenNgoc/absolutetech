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
import { ClusterDocument, ClusterModel } from 'src/models';
import { ClusterCreate, ClusterQr } from './cluster.dto';

@Controller('api/clusters')
@Injectable()
export class ClusterController extends BaseService<ClusterDocument> {
  constructor(
    @InjectModel(ClusterModel.name)
    private readonly clusterModel: Model<ClusterDocument>,
  ) {
    super(clusterModel);
  }

  @Get()
  get(@Query() qr: ClusterQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      includeDeleted: false,
      sort: qr.sort,
      populate: ['shelfs'],
    });
  }

  @Post()
  post(@Body() body: ClusterCreate) {
    return this.create(body);
  }

  @Put(':id')
  put(@Param('id') id: string, @Body() body: ClusterCreate) {
    return this.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.softDelete(id);
  }
}
