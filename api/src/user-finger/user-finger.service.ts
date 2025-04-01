/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserFinger, UserFingerDocument } from './user-finger.schema';
const dayjs = require('dayjs');
import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
const DigestClient = require('digest-fetch');
import { XMLParser } from 'fast-xml-parser';
@Injectable()
export class UserFingerService {
  constructor(
    @InjectModel(UserFinger.name)
    private UserFingerModel: Model<UserFingerDocument>,
  ) {}

  async createFinger(data: Partial<UserFinger>) {
    const log = new this.UserFingerModel(data);
    return log.save();
  }

  async removeFingersByUser(userId: string) {
    return this.UserFingerModel.deleteMany({
      user: new Types.ObjectId(userId),
    });
  }

  async registerFingerHIKVISION(payload: {
    fingerNo: number;
    employeeNo: string;
  }) {
    if (!payload.fingerNo || !payload.employeeNo) {
      throw new Error('fingerNo and employeeNo are required');
    }
    try {
      const client = new DigestClient(
        process.env.HIKVISION_USERNAME,
        process.env.HIKVISION_PASSWORD,
        {
          algorithm: 'MD5',
          timeout: 20000,
        },
      );

      const xmlBody = `
        <CaptureFingerPrintCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
          <fingerNo>${payload.fingerNo}</fingerNo>
        </CaptureFingerPrintCond>
      `;

      const res = await client.fetch(
        `${process.env.HOST_HIKVISION}ISAPI/AccessControl/CaptureFingerPrint`,
        {
          method: 'POST',
          body: xmlBody,
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/xml; charset=UTF-8',
            'x-requested-with': 'XMLHttpRequest',
          },
        },
      );
      if (!res.ok)
        throw new Error(`CaptureFingerPrint failed: ${res.statusText}`);
      const textResult: string = await res.text(); // vì Hikvision hay trả XML chứ không phải JSON
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
      });
      const jsonObj: {
        CaptureFingerPrint: {
          fingerData: string;
          fingerNo: number;
          fingerPrintQuality: number;
          version: string;
        };
      } = parser.parse(textResult);
      if (!jsonObj?.CaptureFingerPrint?.fingerData) {
        throw new Error('No fingerData captured from device');
      }
      const data = {
        FingerPrintCfg: {
          employeeNo: payload.employeeNo,
          enableCardReader: [1],
          fingerPrintID: payload.fingerNo,
          deleteFingerPrint: false,
          fingerType: 'normalFP',
          fingerData: jsonObj.CaptureFingerPrint.fingerData,
          leaderFP: [],
          checkEmployeeNo: true,
        },
      };

      const saveFinger = await client.fetch(
        `${process.env.HOST_HIKVISION}ISAPI/AccessControl/FingerPrint/SetUp?format=json`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'multipart/x-mixed-replace',
          },
        },
      );
      if (!saveFinger.ok)
        throw new Error(`Failed to save fingerprint: ${saveFinger.statusText}`);
      const result: {
        FingerPrintStatus: {
          StatusList: [{ id: number; cardReaderRecvStatus: 0 | 1 }];
        };
      } = await saveFinger.json();
      if (result.FingerPrintStatus.StatusList[0].cardReaderRecvStatus != 1) {
        throw new Error(`Please try another fingerprint`);
      }
      await this.createFinger({
        user: new Types.ObjectId(payload.employeeNo),
        finger_data: jsonObj.CaptureFingerPrint.fingerData,
        no: payload.fingerNo,
      });
      return result;
    } catch (error) {
      throw new Error(
        error?.message ?? 'Failed to register fingerprint with HIKVISION',
      );
    }
  }
}
