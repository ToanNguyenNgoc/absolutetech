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
    try {
      for (const element of dataRawLog) {
        try {
          if (await this.rawLogsExists(element.serialNo)) continue;
          const user = await this.userModel
            .findOne({ employeeID: element.employeeNoString })
            .exec();
          if (user) {
            await this.createRawLog({
              serialNo: element.serialNo,
              user: user?._id as Types.ObjectId,
              employeeNoString: element.employeeNoString,
              name: element.name,
              doorNo: element.doorNo,
              time: new Date(element.time),
              major: element.major,
              minor: element.minor,
              currentVerifyMode: element?.pictureURL ? 'face' : 'fp',
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
    return this.entryLogRawModel.findOne().sort({ createdAt: -1 }).exec();
  }
}
