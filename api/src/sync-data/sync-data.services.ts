/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import { Model, Types } from 'mongoose';
import * as path from 'path';
import { paginate } from 'src/common/pagination.util';
import { EntryLogService } from 'src/entry-log/entry-log.service';
import { MqttService } from 'src/mqtt/mqtt.service';
import { UserFingerService } from 'src/user-finger/user-finger.service';
import { User, UserDocument } from 'src/user/user.schema';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class SyncDataService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly entryLogService: EntryLogService,
    private readonly userFingerService: UserFingerService,
    private readonly mqttService: MqttService,
  ) {}

  async userExists(employee_hik: string) {
    const user = await this.userModel
      .findOne({ employee_hik: employee_hik })
      .exec();
    return user;
  }
}
