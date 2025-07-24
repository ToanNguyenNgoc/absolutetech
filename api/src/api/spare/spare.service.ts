import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common';
import { SpareModel, SpareDocument } from 'src/models';
import { SpareCreate, SpareQr } from './spare.dto';

@Injectable()
export class SpareService extends BaseService<SpareDocument> {
  constructor(
    @InjectModel(SpareModel.name)
    private readonly spareModel: Model<SpareDocument>,
  ) {
    super(spareModel);
  }
  getSpares(qr: SpareQr) {
    return this.findAll({
      page: qr.page,
      limit: qr.limit,
      sort: qr.sort,
      search: qr.search,
      searchFields: ['name', 'part_no', 'material_no'],
      includeDeleted: false,
    });
  }

  createSpare(data: SpareCreate) {
    return this.create(data);
  }

  updateSpare(id: string, data: SpareCreate) {
    return this.update(id, data);
  }

  deleteSpare(id: string) {
    return this.softDelete(id);
  }
}
