/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  BinConfigureModel,
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
import { BinConfigureModule } from '../bin-configure/bin-configure.module';

@Controller('api/bins')
@Injectable()
export class BinController extends BaseService<BinDocument> {
  constructor(
    @InjectModel(BinModel.name)
    private readonly binModel: Model<BinDocument>,
    @InjectModel(BinConfigureModel.name)
    private readonly binConfigureModel: Model<BinConfigureModule>,
    @InjectModel(ClusterModel.name)
    private readonly clusterModel: Model<ClusterDocument>,
    @InjectModel(ShelfModel.name)
    private readonly shelfModel: Model<ShelfDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(SpareModel.name)
    private readonly spareModel: Model<SpareDocument>,
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
      populate: [
        'cluster',
        'shelf',
        'bin_configures',
        {
          path: 'bin_configures',
          populate: {
            path: 'spare',
          },
        },
      ],
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.findById(id, [
      'cluster',
      'shelf',
      'bin_configures',
      {
        path: 'bin_configures',
        populate: {
          path: 'spare',
        },
      },
    ]);
  }

  @Post()
  async post(@Body() body: BinCreate) {
    const bin = await this.create({
      ...body,
      cluster: await this.getCluster(body.cluster),
      shelf: await this.getShelf(body.shelf),
      process_by: await this.getProcess(body.process_by),
    });
    const bin_configures = body.bin_configures || [];
    if (body.bin_configures.length > 0) {
      await Promise.all(
        bin_configures.map(async (bin_configure) =>
          this.binConfigureModel.create({
            ...bin_configure,
            bin: bin._id,
            spare: await this.getSpare(bin_configure.spare),
          }),
        ),
      );
    }
    return bin;
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() body: BinCreate) {
    const bin = await this.update(id, {
      ...body,
      cluster: await this.getCluster(body.cluster),
      shelf: await this.getShelf(body.shelf),
      process_by: await this.getProcess(body.process_by),
    });
    if (!bin) return;
    const bin_configures = body.bin_configures || [];
    if (bin_configures.length > 0) {
      const prev_bin_configures = await this.binConfigureModel.find({
        bin: bin?._id,
      });
      const newMap = new Map(bin_configures.map((b) => [b._id?.toString(), b]));
      for (const oldConfig of prev_bin_configures) {
        //@ts-ignore
        const matched = newMap.get(oldConfig._id.toString());
        if (matched) {
          await this.binConfigureModel.findByIdAndUpdate(oldConfig._id, {
            ...matched,
          });
          //@ts-ignore
          newMap.delete(oldConfig._id.toString());
        } else {
          await this.binConfigureModel.findByIdAndDelete(oldConfig._id);
        }
      }
      for (const b of newMap.values()) {
        await this.binConfigureModel.create({ ...b, bin: bin?._id });
      }
    }
    return bin;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.softDelete(id);
  }
  //

  async getSpare(id?: string): Promise<any> {
    try {
      if (!id) return undefined;
      const spare = await this.spareModel.findById(id);
      if (!spare) return undefined;
      return spare._id;
    } catch (_error) {
      return undefined;
    }
  }

  async getCluster(id?: string): Promise<any> {
    try {
      if (!id) return undefined;
      const cluster = await this.clusterModel.findById(id);
      if (!cluster) return undefined;
      return cluster._id;
    } catch (_error) {
      return undefined;
    }
  }

  async getShelf(id?: string): Promise<any> {
    try {
      if (!id) return undefined;
      const shelf = await this.shelfModel.findById(id);
      if (!shelf) return undefined;
      return shelf._id;
    } catch (error) {
      return undefined;
    }
  }

  async getProcess(id?: string): Promise<any> {
    try {
      if (!id) return undefined;
      const process = await this.userModel.findById(id);
      if (!process) return undefined;
      return process._id;
    } catch (error) {
      return undefined;
    }
  }
}
