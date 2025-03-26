/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { AcsEventCond, AcsEventCondResponse } from './entry-log-raw.enums';
import { EntryLogRaw, EntryLogRawDocument } from './entry-log-raw.schema';
const dayjs = require('dayjs');
import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
const DigestClient = require('digest-fetch');
@Injectable()
export class EntryLogRawService {
  constructor(
    @InjectModel(EntryLogRaw.name)
    private entryLogRawModel: Model<EntryLogRawDocument>,
  ) {}

  async createRawLog(data: Partial<EntryLogRaw>) {
    const log = new this.entryLogRawModel(data);
    return log.save();
  }

  async getLatestEntry(): Promise<EntryLogRawDocument | null> {
    return this.entryLogRawModel.findOne().sort({ createdAt: -1 }).exec();
  }
  async getEventByTimeHIKVISION(payload: AcsEventCond) {
    try {
      const client = new DigestClient(
        process.env.HIKVISION_USERNAME,
        process.env.HIKVISION_PASSWORD,
        {
          algorithm: 'MD5',
          timeout: 20000,
        },
      );
      const res = await client.fetch(
        `${process.env.HOST_HIKVISION}ISAPI/AccessControl/AcsEvent?format=json`,
        {
          method: 'POST',
          body: JSON.stringify({
            AcsEventCond: payload,
          }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'multipart/x-mixed-replace',
          },
        },
      );
      const result = await res.json();
      return result;
    } catch (error) {
      console.log('Error', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const latestInfo = await this.getLatestEntry();
    const scanEvery: AcsEventCondResponse = await this.getEventByTimeHIKVISION({
      searchID: '1',
      searchResultPosition: 0,
      maxResults: 30,
      major: 0,
      minor: 0,
      startTime: dayjs(latestInfo?.createdAt)
        .tz('Asia/Ho_Chi_Minh')
        .format('YYYY-MM-DDTHH:mm:ssZ'),
      endTime: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ssZ'),
    });
    if (
      scanEvery?.AcsEvent?.responseStatusStrg == 'OK' &&
      scanEvery?.AcsEvent.InfoList.length > 0
    ) {
      for (const element of scanEvery?.AcsEvent.InfoList || []) {
        if (element.currentVerifyMode != 'invalid') {
          await this.createRawLog({
            employeeNoString: element.employeeNoString,
            name: element.name,
            doorNo: element.doorNo,
            time: new Date(element.time),
            major: element.major,
            minor: element.minor,
            currentVerifyMode: element?.pictureURL ? 'face' : 'fp',
          });
        }
      }
    }
  }
}
