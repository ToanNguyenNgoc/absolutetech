import {
  Controller,
  Get,
  Injectable,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common';
import { SyncData, SyncDataDocument } from 'src/sync-data/sync-data.schema';
import { SyncDataLogQr } from './sync-data-log.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NAME } from 'src/constants';

@Controller('api/sync-data-logs')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class SyncDataLogController extends BaseService<SyncDataDocument> {
  constructor(
    @InjectModel(SyncData.name)
    private readonly syncDataModel: Model<SyncDataDocument>,
  ) {
    super(syncDataModel);
  }

  @Get()
  get(@Query() qr: SyncDataLogQr) {
    return this.findWithAggregate({
      page: qr.page,
      limit: qr.limit,
      pipeline: [{ $project: { data: 0 } }],
      sort: '-createdAt',
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.findById(id);
  }
}
