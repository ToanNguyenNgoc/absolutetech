import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EntryLog, EntryLogDocument } from './entry-log.schema';
import { paginate } from 'src/common/pagination.util';
import {
  EntryLogRaw,
  EntryLogRawDocument,
} from 'src/entry-log-raw/entry-log-raw.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class EntryLogService {
  private readonly logger = new Logger(EntryLogService.name);

  constructor(
    @InjectModel(EntryLog.name)
    private entryLogModel: Model<EntryLogDocument>,
    @InjectModel(EntryLogRaw.name)
    private entryLogRawModel: Model<EntryLogRawDocument>,
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
      { populate: ['user', 'rawLogs'] },
    );
  }

  async createFakeLog(userId: string): Promise<EntryLog> {
    const now = new Date();
    const time_in = new Date(
      now.getTime() - Math.floor(Math.random() * 60) * 60000,
    );
    const time_out = new Date(
      time_in.getTime() + (30 + Math.floor(Math.random() * 90)) * 60000,
    );
    const duration = Math.round(
      (time_out.getTime() - time_in.getTime()) / 60000,
    );

    const entryLog = new this.entryLogModel({
      user: userId,
      date: now,
      time_in,
      time_out,
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

  @Cron('0 23 * * *')
  async processDailyLogs() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const userIds: Types.ObjectId[] = await this.entryLogRawModel.distinct(
        'user',
        {
          time: { $gte: today, $lt: tomorrow },
        },
      );

      for (const userId of userIds) {
        const logs = await this.entryLogRawModel
          .find({
            user: userId,
            time: { $gte: today, $lt: tomorrow },
          })
          .sort({ time: 1 });

        console.log(logs);
        if (!logs || logs.length === 0) continue;

        const checkIn = logs[0].time;
        let checkOut: Date | null = null;

        if (logs.length > 1) {
          const lastLogTime = logs[logs.length - 1].time;
          if (lastLogTime.getHours() < 12) {
            checkOut = lastLogTime;
          } else {
            checkOut = new Date(today);
            checkOut.setHours(17, 0, 0, 0);
          }
        } else {
          checkOut = null;
        }

        const duration = checkOut
          ? (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
          : undefined;

        const newEntryLog = new this.entryLogModel({
          user: userId,
          date: today,
          time_in: checkIn,
          time_out: checkOut,
          duration,
        });
        const savedEntryLog = await newEntryLog.save();

        await this.entryLogRawModel.updateMany(
          { user: userId, time: { $gte: today, $lt: tomorrow } },
          { entry_log_id: savedEntryLog._id },
        );
      }
      this.logger.log('Daily log processing complete');
    } catch (error) {
      this.logger.error('Error processing daily logs', error);
    }
  }
}
