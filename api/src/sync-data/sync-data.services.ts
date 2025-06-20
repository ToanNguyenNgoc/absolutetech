/* eslint-disable */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import SqlString from 'sqlstring';
import { UserFinger } from 'src/user-finger/user-finger.schema';
import { User, UserDocument } from 'src/user/user.schema';
import { DateUtil } from 'src/utils/date.util';
import { FetchForTabletDto } from './dto/fetch-for-tablet.dto';
import { SyncDataCreateDto } from './dto/sync-data-create.dto';
import { SyncFromDeviceDto } from './dto/sync-from-device.dto';
import { SyncData } from './sync-data.schema';

interface SyncableDocument {
  _id: string | import('mongoose').Types.ObjectId;
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  [key: string]: any;
}

@Injectable()
export class SyncDataService {
  constructor(
    @InjectModel(SyncData.name) private syncDataModel: Model<SyncData>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserFinger.name) private userFingerModel: Model<UserFinger>,
  ) {}

  async fetchForTablet(fetchForTabletDto: FetchForTabletDto) {
    try {
      const models = [
        { model: this.userModel, table: 'users' },
        { model: this.userFingerModel, table: 'user_fingers' },
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
        scripts: scriptExecute,
        timestamp_fetch: timeFetch,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch data: ${error.message}`);
    }
  }

  async syncFromDevice(syncFromDeviceDto: SyncFromDeviceDto) {
    try {
      await this.insertNewSyncData({
        device_id: syncFromDeviceDto.device_id,
        timestamp_push: DateUtil.currentDateString(),
        data: JSON.stringify(syncFromDeviceDto.scripts),
      });
    } catch (error) {
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
    models: { model: Model<any>; table: string }[],
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
        // Filter out soft-deleted records for incremental syncs
        const query = isFetchAll
          ? { updatedAt: { $gte: new Date(lastTimestamp) } }
          : { updatedAt: { $gte: new Date(lastTimestamp) }, deletedAt: null };

        const documents = await model
          .find(query)
          .lean({ virtuals: false })
          .exec();
        // @ts-ignore
        const syncColumns = model.getSyncColumns?.() || [];
        if (!syncColumns.length) {
          console.warn(`No sync columns defined for table ${table}`);
          continue;
        }

        for (const doc of documents as unknown as SyncableDocument[]) {
          // Transform _id to id
          const transformedDoc = { ...doc, id: doc._id.toString() };
          // @ts-ignore
          delete transformedDoc._id;

          const createdAt = moment(new Date(transformedDoc.createdAt));
          const updatedAt = moment(new Date(transformedDoc.updatedAt));
          const lastTime = moment(lastTimestamp);

          if (isFetchAll || lastTime.isBefore(createdAt)) {
            if (transformedDoc.deletedAt) {
              result.delete.push(
                `DELETE FROM ${table} WHERE id = ${SqlString.escape(transformedDoc.id)}`,
              );
            } else {
              result.insert.push(
                this.toSqlInsert(transformedDoc, table, syncColumns),
              );
            }
          } else if (updatedAt.isAfter(createdAt)) {
            if (transformedDoc.deletedAt) {
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
      let val = doc[col];
      if (val instanceof Date) {
        val = moment(val).format('YYYY-MM-DD HH:mm:ss');
      } else if (col === 'user' && val instanceof Object) {
        val = val.toString(); // Convert ObjectId to string for UserFinger
      }
      fields.push(`\`${col}\``);
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
      let val = doc[col];
      if (val instanceof Date) {
        val = moment(val).format('YYYY-MM-DD HH:mm:ss');
      } else if (col === 'user' && val instanceof Object) {
        val = val.toString(); // Convert ObjectId to string for UserFinger
      }
      pairs.push(`\`${col}\`=${SqlString.escape(val)}`);
    }

    return `UPDATE ${table} SET ${pairs.join(', ')} WHERE id = ${SqlString.escape(doc.id)}`;
  }
}
