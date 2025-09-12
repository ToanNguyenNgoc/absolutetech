/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HolidayModel, NormalWorkingHourModel } from 'src/models';
import moment from 'moment';

@Injectable()
export class DaySalaryCheckService {
  constructor(
    @InjectModel(HolidayModel.name)
    private readonly holidayModel: Model<HolidayModel>,
    @InjectModel(NormalWorkingHourModel.name)
    private readonly normalWorkingHourModel: Model<NormalWorkingHourModel>,
  ) { }
  /**
   * Check date of Timesheet is Holiday or Sunday
   * @param {string|null} isoDate - UTC ISO String (e.g., "2025-08-02T22:30:00.000Z")
   * @returns {boolean|null}
   */
  async checkHolidayAndSunday(isoDate?: any) {
    if (!isoDate) return false;
    const dayNames = Object.values(NormalWorkingHourModel.WEEKDAYS);
    const date = new Date(isoDate);
    const weekday = dayNames[date.getDay()];
    if (weekday == NormalWorkingHourModel.WEEKDAYS.SUNDAY) return true;
    const monthDay = moment.utc(date).format('MM-DD');
    const holiday = await this.holidayModel
      .findOne({
        $expr: { $eq: [{ $dateToString: { format: '%m-%d', date: '$date', timezone: '+00:00' } }, monthDay] },
      })
      .lean();
    return !!holiday;
  }
}
