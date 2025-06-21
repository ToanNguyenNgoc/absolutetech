/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { InfoList } from './entry-log-raw.enums';
import { EntryLogRaw, EntryLogRawDocument } from './entry-log-raw.schema';
@Injectable()
export class EntryLogRawService {
  constructor(
    @InjectModel(EntryLogRaw.name)
    private entryLogRawModel: Model<EntryLogRawDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  //Import logs fom PC
  async importRawLogList(dataRawLog: InfoList[]) {
    console.log(dataRawLog.length);
    try {
      for (const element of dataRawLog) {
        try {
          if (await this.rawLogsExists(element.serialNo)) continue;
          const user = await this.userModel
            .findOne({ employee_id: element.employee_no_string })
            .exec();
          if (user) {
            await this.createRawLog({
              serialNo: element.serialNo,
              user: user?._id as Types.ObjectId,
              employee_no_string: element.employee_no_string,
              name: element.name,
              door_no: element.door_no,
              time: new Date(element.time),
              major: element.major,
              minor: element.minor,
              current_verify_mode: element?.pictureURL ? 'face' : 'fp',
            });
          }
        } catch (error) {
          console.error(
            `❌ Error importing user ${element.name}:`,
            error.message,
          );
        }
      }
    } catch (error) {
      console.log('❌ Fatal Error:', error);
    }
  }

  async rawLogsExists(serialNo: number): Promise<any> {
    const raw = await this.entryLogRawModel.findOne({ serialNo }).exec();
    return !!raw;
  }
  async createRawLog(data: Partial<EntryLogRaw>) {
    const log = new this.entryLogRawModel(data);
    return log.save();
  }

  async getLatestEntry(): Promise<EntryLogRawDocument | null> {
    return this.entryLogRawModel.findOne().sort({ created_at: -1 }).exec();
  }
}
