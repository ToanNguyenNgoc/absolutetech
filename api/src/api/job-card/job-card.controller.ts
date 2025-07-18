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
import { JobCardDocument, JobCardModel } from 'src/models/job-card.scheme';
import { JobCardCreate, JobCardQr } from './job-card.dto';
import { VehicleDocument, VehicleModel } from 'src/models';

@Controller('api/job-cards')
@Injectable()
export class JobCardController extends BaseService<JobCardDocument> {
  constructor(
    @InjectModel(JobCardModel.name)
    private readonly jobCardModel: Model<JobCardDocument>,
    @InjectModel(VehicleModel.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {
    super(jobCardModel);
  }

  @Get()
  get(@Query() qr: JobCardQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      search: qr.search,
      searchFields: ['card_num', 'wo'],
      sort: qr.sort,
      populate: ['vehicle'],
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.findById(id, ['vehicle']);
  }

  @Post()
  async post(@Body() body: JobCardCreate) {
    return this.create({
      ...body,
      vehicle: (await this.getVehicle(body.vehicle))?._id,
    });
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() body: JobCardCreate) {
    return this.update(id, {
      ...body,
      vehicle: (await this.getVehicle(body.vehicle))?._id,
    });
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.softDelete(id);
  }

  async getVehicle(id?: string): Promise<any> {
    if (!id) return null;
    try {
      const vehicle = await this.vehicleModel.findById(id);
      if (!vehicle) return null;
      return vehicle;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
