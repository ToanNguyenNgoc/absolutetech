import { Controller, Get, Injectable, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BaseService } from 'src/common';
import { RequestLogDocument, RequestLogModel } from 'src/models';
import { RequestLogQr } from './request-log.dto';

@Controller('api/logs')
// @UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class RequestLogController extends BaseService<RequestLogDocument> {
  constructor(
    @InjectModel(RequestLogModel.name)
    private readonly requestLogModel: Model<RequestLogDocument>,
  ) {
    super(requestLogModel);
  }

  @Get()
  get(@Query() qr: RequestLogQr) {
    return this.findWithAggregate({
      page: qr.page,
      limit: qr.limit,
      sort: '-createdAt',
    });
  }
}
