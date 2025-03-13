import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EntryLog, EntryLogDocument } from './entry-log.schema';
import { paginate } from 'src/common/pagination.util';

@Injectable()
export class EntryLogService {
  constructor(
    @InjectModel(EntryLog.name)
    private entryLogModel: Model<EntryLogDocument>,
  ) {}

  async findAllPaginated(page = 1, limit = 10, userIds?: string[]) {
    let query = {};

    if (userIds !== undefined) {
      if (userIds.length === 0) {
        query = { _id: { $exists: false } };
      } else {
        query = { user: { $in: userIds } };
      }
    }

    return paginate(
      this.entryLogModel,
      page,
      limit,
      query,
      {},
      { populate: 'user' },
    );
  }

  async createFakeLog(userId: string): Promise<EntryLog> {
    const now = new Date();
    const timeIn = new Date(
      now.getTime() - Math.floor(Math.random() * 60) * 60000,
    );
    const timeOut = new Date(
      timeIn.getTime() + (30 + Math.floor(Math.random() * 90)) * 60000,
    );
    const duration = Math.round((timeOut.getTime() - timeIn.getTime()) / 60000);

    const entryLog = new this.entryLogModel({
      user: userId,
      date: now,
      timeIn,
      timeOut,
      duration,
    });
    return entryLog.save();
  }

  async findAllNoPaginated() {
    return this.entryLogModel.find().populate('user').exec();
  }

  async findAllByQuery(query: any) {
    return this.entryLogModel.find(query).populate('user').exec();
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.entryLogModel.deleteMany({ user: new Types.ObjectId(userId) });
  }
}
