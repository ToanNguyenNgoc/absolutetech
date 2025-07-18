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
  VehicleDocument,
  VehicleModel,
  VehicleTypeDocument,
  VehicleTypeModel,
} from 'src/models';
import { VehicleCreate, VehicleQr } from './vehicle.dto';
import { UserService } from 'src/user/user.service';

@Controller('api/vehicles')
@Injectable()
export class VehicleController extends BaseService<VehicleDocument> {
  constructor(
    @InjectModel(VehicleModel.name)
    private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(VehicleTypeModel.name)
    private readonly vehicleTypeModel: Model<VehicleTypeDocument>,
    private readonly userService: UserService,
  ) {
    super(vehicleModel);
  }

  @Get('')
  get(@Query() qr: VehicleQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      search: qr.search,
      searchFields: ['name', 'vehicle_num'],
      sort: qr.sort,
      populate: ['vehicle_type', 'created_by', 'updated_by'],
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.findById(id, ['vehicle_type', 'created_by', 'updated_by']);
  }

  @Post()
  async post(@Body() body: VehicleCreate) {
    return this.create({
      ...body,
      vehicle_type: (await this.getVehicleType(body.vehicle_type))?._id,
      created_by: (await this.userService.findOneById(body.created_by))?._id,
      updated_by: (await this.userService.findOneById(body.updated_by))?._id,
    });
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() body: VehicleCreate) {
    return this.update(id, {
      ...body,
      vehicle_type: (await this.getVehicleType(body.vehicle_type))?._id,
      created_by: (await this.userService.findOneById(body.created_by))?._id,
      updated_by: (await this.userService.findOneById(body.updated_by))?._id,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.softDelete(id);
  }

  async getVehicleType(id?: string): Promise<any> {
    try {
      if (!id) return null;
      const vehicleType = await this.vehicleTypeModel.findById(id);
      if (!vehicleType) return;
      return vehicleType;
    } catch (_err) {
      return null;
    }
  }
}
