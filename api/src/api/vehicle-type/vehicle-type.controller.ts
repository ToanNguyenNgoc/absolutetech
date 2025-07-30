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
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common';
import { VehicleTypeModel, VehicleTypeDocument } from 'src/models';
import { VehicleTypeCreate, VehicleTypeQr } from './vehicle-type.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NAME } from 'src/constants';

@Controller('api/vehicle-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
@Injectable()
export class VehicleTypeController extends BaseService<VehicleTypeDocument> {
  constructor(
    @InjectModel(VehicleTypeModel.name)
    private readonly vehicleTypeModel: Model<VehicleTypeDocument>,
  ) {
    super(vehicleTypeModel);
  }
  @Get()
  get(@Query() qr: VehicleTypeQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      sort: qr.sort,
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.findById(id);
  }

  @Post()
  post(@Body() body: VehicleTypeCreate) {
    return this.create(body);
  }

  @Put(':id')
  put(@Param('id') id: string, @Body() body: VehicleTypeCreate) {
    return this.update(id, body);
  }

  @Delete(':id')
  deleteVehicleType(@Param('id') id: string) {
    return this.softDelete(id);
  }
}
