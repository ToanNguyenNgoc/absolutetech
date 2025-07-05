/* eslint-disable */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Model } from 'mongoose';
import SqlString from 'sqlstring';
import { UserFinger } from 'src/user-finger/user-finger.schema';
import { User, UserDocument } from 'src/user/user.schema';
import { DateUtil } from 'src/utils/date.util';
import { FetchForTabletDto } from './dto/fetch-for-tablet.dto';
import { SyncDataCreateDto } from './dto/sync-data-create.dto';
import { SyncFromDeviceDto } from './dto/sync-from-device.dto';
import { SyncData } from './sync-data.schema';
import { JobNumber } from 'src/job-number/schemas/job-number.schema';
import { Timesheet } from 'src/timesheet/timesheet.schema';
import { TimesheetDetail } from 'src/timesheet-detail/timesheet-detail.schema';

interface SyncableDocument {
  _id: string | import('mongoose').Types.ObjectId;
  id?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  [key: string]: any;
}

interface SyncableModel<T> extends Model<T> {
  getSyncColumns: () => string[];
}

@Injectable()
export class SyncDataService {
  private tableMap: Record<string, Model<any>>;

  constructor(
    @InjectModel(SyncData.name)
    private syncDataModel: Model<SyncData>,
    @InjectModel(User.name)
    private userModel: SyncableModel<UserDocument>,
    @InjectModel(UserFinger.name)
    private userFingerModel: SyncableModel<UserFinger>,
    @InjectModel(JobNumber.name)
    private jobNumberModule: SyncableModel<JobNumber>,
    @InjectModel(Timesheet.name)
    private timesheetModel: SyncableModel<Timesheet>,
    @InjectModel(TimesheetDetail.name)
    private timesheetDetailModel: SyncableModel<TimesheetDetail>,
  ) {
    this.tableMap = {
      timesheet: this.timesheetModel,
      timesheetDetail: this.timesheetDetailModel,
    };
  }

  async fetchForTablet(fetchForTabletDto: FetchForTabletDto) {
    try {
      const models = [
        { model: this.userModel, table: 'users' },
        { model: this.userFingerModel, table: 'user_fingers' },
        { model: this.jobNumberModule, table: 'jobnumbers' },
      ];

      const scriptExecute = await this.fetchData(fetchForTabletDto, models);
      const timeFetch = DateUtil.currentDateString();

      if (fetchForTabletDto.timestamp_fetch) {
        await this.insertNewSyncData({
          device_id: fetchForTabletDto.device_id,
          timestamp_fetch: timeFetch,
          data: JSON.stringify(scriptExecute),
        });
      }
      return {
        code: true,
        scripts: scriptExecute,
        timestamp_fetch: timeFetch,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch data: ${error.message}`);
    }
  }

  async syncFromDevice(data: SyncFromDeviceDto) {
    try {
      const timeSync = DateUtil.currentDateString();
      for (const [tableName, rows] of Object.entries(data.tables)) {
        const model = this.tableMap[tableName];
        // console.log('tableName', tableName);
        // console.log('rows', rows);
        // console.log('model', model);
        if (model && rows.length) {
          await model.bulkWrite(
            rows.map((row) => ({
              updateOne: {
                filter: { id: row.id }, // use Pk id UUID
                update: { $set: row },
                upsert: true,
              },
            })),
          );
        }
      }
      console.log({
        code: true,
        timestamp_fetch: timeSync,
      });
      return {
        code: true,
        timestamp_fetch: timeSync,
      };
    } catch (error) {
      console.log('syncFromDevice', error);

      throw new BadRequestException(
        `Failed to sync from device: ${error.message}`,
      );
    }
  }

  async insertNewSyncData(data: SyncDataCreateDto) {
    try {
      await this.syncDataModel.create(data);
    } catch (error) {
      throw new Error(`Failed to insert sync data: ${error.message}`);
    }
  }

  async fetchData(
    fetchForTabletDto: FetchForTabletDto,
    models: { model: SyncableModel<any>; table: string }[],
  ) {
    try {
      const lastTimestamp =
        fetchForTabletDto.timestamp_fetch || '1970-01-01 00:00:00';
      if (
        fetchForTabletDto.timestamp_fetch &&
        isNaN(new Date(lastTimestamp).getTime())
      ) {
        throw new Error('Invalid timestamp format');
      }
      const isFetchAll = !fetchForTabletDto.timestamp_fetch;
      const result: { insert: string[]; update: string[]; delete: string[] } = {
        insert: [],
        update: [],
        delete: [],
      };

      for (const { model, table } of models) {
        const query = isFetchAll
          ? { updated_at: { $gte: new Date(lastTimestamp) } }
          : { updated_at: { $gte: new Date(lastTimestamp) }, deleted_at: null };

        const documents = await model
          .find(query)
          .lean({ virtuals: false })
          .exec();
        const syncColumns = model.getSyncColumns?.() || [];
        if (!syncColumns.length) {
          console.warn(`No sync columns defined for table ${table}`);
          continue;
        }

        for (const doc of documents as unknown as SyncableDocument[]) {
          const transformedDoc = { ...doc, id: doc._id.toString() };
          // @ts-ignore
          delete transformedDoc._id;
          const created_at = moment(new Date(transformedDoc.created_at));
          const updated_at = moment(new Date(transformedDoc.updated_at));
          const lastTime = moment(lastTimestamp);

          if (isFetchAll || lastTime.isBefore(created_at)) {
            if (transformedDoc.deleted_at) {
              result.delete.push(
                `DELETE FROM ${table} WHERE id = ${SqlString.escape(transformedDoc.id)}`,
              );
            } else {
              result.insert.push(
                this.toSqlInsert(transformedDoc, table, syncColumns),
              );
            }
          } else if (updated_at.isAfter(created_at)) {
            if (transformedDoc.deleted_at) {
              result.delete.push(
                `DELETE FROM ${table} WHERE id = ${SqlString.escape(transformedDoc.id)}`,
              );
            } else {
              result.update.push(
                this.toSqlUpdate(transformedDoc, table, syncColumns),
              );
            }
          } else {
            result.insert.push(
              this.toSqlInsert(transformedDoc, table, syncColumns),
            );
          }
        }
      }

      console.log('Generated SQL:', result);
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  toSqlInsert(doc: SyncableDocument, table: string, columns: string[]): string {
    if (!columns.length) {
      throw new Error(`No sync columns defined for table ${table}`);
    }
    const fields: string[] = [];
    const values: string[] = [];

    for (const col of columns) {
      let column = col;
      let val = doc[col];
      if (val instanceof Date) {
        val = moment(val).format('YYYY-MM-DD HH:mm:ss');
      } else if (val instanceof mongoose.Types.ObjectId) {
        if (column != 'id') {
          column = `${column}_id`;
        }
        val = val.toString();
      }
      fields.push(`\`${column}\``);
      values.push(SqlString.escape(val));
    }
    return `INSERT OR REPLACE INTO ${table} (${fields.join(', ')}) VALUES (${values.join(', ')})`;
  }

  toSqlUpdate(doc: SyncableDocument, table: string, columns: string[]): string {
    if (!columns.length) {
      throw new Error(`No sync columns defined for table ${table}`);
    }
    const pairs: string[] = [];

    for (const col of columns) {
      let column = col;
      let val = doc[col];
      if (val instanceof Date) {
        val = moment(val).format('YYYY-MM-DD HH:mm:ss');
      } else if (val instanceof mongoose.Types.ObjectId) {
        if (column != 'id') {
          column = `${column}_id`;
        }
        val = val.toString();
      }
      pairs.push(`\`${column}\`=${SqlString.escape(val)}`);
    }

    return `UPDATE ${table} SET ${pairs.join(', ')} WHERE id = ${SqlString.escape(doc.id)}`;
  }
}
