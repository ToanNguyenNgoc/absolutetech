/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import { Model, PipelineStage, Types } from 'mongoose';
import * as path from 'path';
import { EntryLogService } from 'src/entry-log/entry-log.service';
// import { MqttService } from 'src/mqtt/mqtt.service';
import { UserFingerService } from 'src/user-finger/user-finger.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, UserItemRequest } from './user.enums';
import { User, UserDocument } from './user.schema';
import { WarehouseService } from 'src/external/warehouse.service';
import { paginate } from 'src/common/pagination.util';
import { BaseService } from 'src/common';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly entryLogService: EntryLogService,
    private readonly userFingerService: UserFingerService,
    // private readonly mqttService: MqttService,
    private warehouseService: WarehouseService,
  ) {
    super(userModel)
  }

  async userExists(employee_hik: string) {
    const user = await this.userModel
      .findOne({ employee_hik: employee_hik })
      .exec();
    return user;
  }

  async updateOrCreate(dto: Partial<User>) {
    let user = await this.userModel.findOne({ username: dto.username });
    if (user) {
      await this.userModel.findOneAndUpdate({ username: dto.username }, {
        ...dto
      });
      console.log('Update user: ', user?.username);
    } else {
      user = await this.createUser(dto);
      console.log('Update user: ', user?.username);
    }
    return user
  }

  async createUser(dto: Partial<User>) {
    const shortId = uuidv4().slice(0, 4);
    const hashed = await bcrypt.hash(dto.password ?? '', 10);
    const created = new this.userModel({
      ...dto,
      employee_hik:
        dto.employee_hik ||
        `${dto.employee_id?.toLocaleLowerCase().trim() || ''}hik${shortId}`.slice(
          0,
          32,
        ),
      password: hashed,
    });
    console.log('Create User', created);
    const res = await created.save();
    await this.warehouseService.syncUserToLaravel('create', {
      login_name: dto.username,
      name: dto.full_name,
      password: dto.password,
      email: dto.email ?? null,
      employee_id: dto.employee_id,
      card_id: dto.employee_id,
      role: dto.role,
      dept: dto.position ?? null,
      avatar: dto.avatar ?? null,
    });

    return res;
  }

  async findAllPaginated(page = 1, limit = 10, roles: string) {
    // return paginate(
    //   this.userModel,
    //   page,
    //   limit,
    //   {},
    //   { password: 0 },
    //   { populate: 'userFingers' },
    // );
    const pipeline: PipelineStage[] = [
      { $project: { password: 0 } },
      {
        $lookup: {
          from: 'user_finger',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$user', { $toString: '$$userId' }] } } },
          ],
          as: 'userFingers',
        },
      }
    ];
    const roleIds = roles?.split('|').filter(i => !isNaN(Number(i))).map(i => Number(i));
    if (roleIds?.length > 0) {
      pipeline.push({ $match: { role: { $in: roleIds } } })
    }
    return this.findWithAggregate({
      page,
      limit,
      pipeline,
      sort: '-createdAt'
    })
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneByField(
    field: string,
    value: any,
  ): Promise<UserDocument | null> {
    const query: any = {};
    query[field] = value;
    return this.userModel.findOne(query).exec();
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    try {
      if (dto.email) {
        const existingEmail = await this.userModel
          .findOne({
            email: dto.email,
            _id: { $ne: id },
          })
          .exec();
        if (existingEmail) {
          throw new UnprocessableEntityException('Email already exists');
        }
      }
      if (dto.username) {
        const existingUsername = await this.userModel
          .findOne({
            username: dto.username,
            _id: { $ne: id },
          })
          .exec();
        if (existingUsername) {
          throw new UnprocessableEntityException('Username already exists');
        }
      }

      if ('password' in dto) {
        delete dto['password'];
      }

      const updated = await this.userModel
        .findByIdAndUpdate(id, dto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updated) {
        throw new UnprocessableEntityException('User not found');
      }
      await this.warehouseService.syncUserToLaravel('update', {
        login_name: updated.username,
        name: dto.full_name,
        email: updated.email ?? null,
        employee_id: updated.employee_id,
        card_id: updated.employee_id,
        role: updated.role,
        dept: updated.position ?? null,
      });

      return updated;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<UserDocument> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    await this.warehouseService.syncUserToLaravel('delete', {
      employee_id: deleted?.employee_id,
    });
    if (!deleted) {
      throw new UnprocessableEntityException('User not found');
    }

    try {
      await this.entryLogService.deleteByUser(String(deleted._id));
      console.log(`Entry logs for user ${deleted._id} deleted`);
    } catch (err) {
      console.error('Error deleting entry logs:', err);
    }

    if (deleted.avatar) {
      console.log('deleted.avatar', deleted.avatar);
      const avatarPath = deleted.avatar.replace(/^\/?api\//, ''); // Xóa dư "api/" ở đầu nếu có
      const filePath = path.join(__dirname, '..', '..', avatarPath);
      try {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting avatar file:', err);
          } else {
            console.log('Avatar file deleted:', filePath);
          }
        });
      } catch (err) {
        console.error('Error deleting avatar file:', err);
      }
    }
    // this.mqttService.publish(
    //   process.env.MQTT_TOPIC_DELETE_USER as string,
    //   JSON.stringify(deleted),
    // );
    return deleted;
  }

  async importUsersFromCsv(filePath: string) {
    const createdUsers: any = [];
    const skippedUsers: any = [];

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const records = await new Promise<any[]>((resolve, reject) => {
      const results: any = [];
      parse(fileContent, {
        columns: true,
        trim: true,
        skipEmptyLines: true,
      })
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    for (const record of records) {
      const {
        full_name,
        username,
        email,
        employee_id,
        role,
        position,
        gender,
        birthday,
        phone,
        address,
        password,
      } = record;

      const existed = await this.userModel.findOne({
        $or: [{ username }, { email }, { employee_id }],
      });

      if (existed) {
        skippedUsers.push({
          row: record,
          reason: 'Duplicate username/email/employee_id',
        });
        continue;
      }

      const user = new this.userModel({
        full_name,
        username,
        email,
        employee_id,
        role,
        position,
        gender,
        birthday,
        phone,
        address,
        password: await bcrypt.hash(password, 10),
      });

      try {
        const saved = await user.save();
        const userObj: any = saved.toObject();
        delete userObj.password;
        createdUsers.push(userObj);
      } catch (err) {
        skippedUsers.push({
          row: record,
          reason: err.message,
        });
      }
    }

    fs.unlinkSync(filePath);

    return {
      totalRows: records.length,
      createdCount: createdUsers.length,
      skippedCount: skippedUsers.length,
      skippedUsers,
      createdUsers,
    };
  }

  async findAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByUsernameOrEmail(search: string): Promise<User[]> {
    return this.userModel
      .find({
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      })
      .exec();
  }

  async findOneByUsernameOrEmail(search: string): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      })
      .exec();
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async getAllUsersNotSync() {
    return await this.userModel.find({ is_sync: 0 });
  }

  // sync from HIK to cloud
  async importUsers(dataUser: UserItemRequest[]) {
    try {
      for (const user of dataUser) {
        try {
          console.log(`🔄 Importing user: ${user.name} (${user.employeeNo})`);
          const exists = await this.userExists(user.employeeNo);
          if (exists?._id) {
            console.log(`✅ User exists: ${user.name}`);
            if (user.numOfFP > 0) {
              await this.userFingerService.removeFingersByUser(
                exists._id as Types.ObjectId,
              );
              console.log(`🧹 Removed old fingers for ${user.name}`);
              await Promise.all(
                user.fingerList.map((element) =>
                  this.userFingerService.createFinger({
                    user: exists._id as Types.ObjectId,
                    finger_data: element.fingerData,
                    no: element.fingerPrintID,
                  }),
                ),
              );
              console.log(`✋ Added new fingers for ${user.name}`);
            }
            if (user.faceURL) {
              try {
                await this.userModel
                  .updateOne(
                    { _id: exists._id },
                    { $set: { face_hik: user.faceURL, is_sync: 1 } },
                  )
                  .exec();
              } catch (error) {
                console.log(error);
              }
            }
            continue;
          }

          const res = await this.createUser({
            employee_id: user.employeeNo,
            employee_hik: user.employeeNo,
            full_name: user.name || user.employeeNo,
            username: user.employeeNo,
            password: '123123',
            face_hik: user.faceURL ?? '',
            email: `${user.employeeNo}@gmail.com`,
            gender: user.gender,
            role: user.userType == 'admin' ? Role.SUPER_ADMIN : Role.STORE,
            is_sync: 1,
          });
          console.log(`🆕 Created new user: ${user.name}`);

          if (user.numOfFP > 0) {
            await Promise.all(
              user.fingerList.map((element) =>
                this.userFingerService.createFinger({
                  user: res._id as Types.ObjectId,
                  finger_data: element.fingerData,
                  no: element.fingerPrintID,
                }),
              ),
            );
            console.log(`✋ Added fingers for new user ${user.name}`);
          }
        } catch (error) {
          console.error(`❌ Error importing user ${user.name}:`, error.message);
        }
      }
      console.log('🎉 Finished importing all users!');
    } catch (error) {
      console.log('❌ Fatal Error:', error);
    }
  }

  async deleteUserByEmployee(employee_hik: string) {
    try {
      console.log(`🗑 Deleting user with employee_id: ${employee_hik}`);
      const deleted = await this.userModel.deleteOne({ employee_hik });
      if (deleted.deletedCount > 0) {
        console.log(
          `✅ User with employee_id ${employee_hik} deleted successfully.`,
        );
      } else {
        console.warn(`⚠️ No user found with employee_id: ${employee_hik}`);
      }
    } catch (error) {
      console.error(
        `❌ Error deleting user with employee_id ${employee_hik}:`,
        error,
      );
    }
  }

  async updateIsSyncUser(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { is_sync: 1 });
  }

  async getTechnicianAndSupervisorList() {
    return this.userModel
      .find(
        { role: { $in: [Role.SUPERVISOR, Role.SUPERVISOR] } },
        { full_name: 1 },
      )
      .exec();
  }

  async findOneById(id?: string): Promise<any> {
    try {
      if (!id) return null;
    const user = await this.userModel.findById(id);
    if (!user) return null;
    return user;
    } catch (_error) {
      return null
    }
  }
}
