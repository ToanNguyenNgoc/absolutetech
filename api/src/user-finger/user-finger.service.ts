/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserFinger } from './user-finger.schema';
const dayjs = require('dayjs');
import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
@Injectable()
export class UserFingerService {
  constructor(
    @InjectModel(UserFinger.name)
    private UserFingerModel: Model<UserFinger>,
  ) {}

  async createFinger(data: Partial<UserFinger> | Partial<UserFinger>[]) {
    if (Array.isArray(data)) {
      // Nếu là array → insertMany
      return this.UserFingerModel.insertMany(data);
    } else {
      // Nếu là object đơn → save như cũ
      const log = new this.UserFingerModel(data);
      return log.save();
    }
  }

  async removeFingersByUser(userId: Types.ObjectId) {
    return this.UserFingerModel.deleteMany({
      user: userId,
    });
  }

  async removeFingersAll() {
    return this.UserFingerModel.deleteMany({});
  }
}
