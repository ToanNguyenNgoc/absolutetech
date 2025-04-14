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
import { UserFingerService } from 'src/user-finger/user-finger.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, UserItemRequest } from './user.enums';
import { User, UserDocument } from './user.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly entryLogService: EntryLogService,
    private readonly userFingerService: UserFingerService,
  ) {}

  async userExists(employeeID: string) {
    const user = await this.userModel.findOne({ employeeID }).exec();
    return user;
  }

  async createUser(dto: Partial<User>) {
    const shortId = uuidv4().slice(0, 4);
    const hashed = await bcrypt.hash(dto.password ?? '', 10);
    const created = new this.userModel({
      ...dto,
      employee_hik: `${dto.employeeID?.toLocaleLowerCase().trim()}hik${shortId}`,
      password: hashed,
    });
    const res = await created.save();
    return res;
  }

  async findAllPaginated(page = 1, limit = 10) {
    return paginate(
      this.userModel,
      page,
      limit,
      {},
      { password: 0 },
      { populate: 'userFingers' },
    );
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

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDocument> {
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
    return updated;
  }

  async deleteUser(id: string): Promise<UserDocument> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
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
        fullName,
        username,
        email,
        employeeID,
        role,
        position,
        gender,
        birthday,
        phone,
        address,
        password,
      } = record;

      const existed = await this.userModel.findOne({
        $or: [{ username }, { email }, { employeeID }],
      });

      if (existed) {
        skippedUsers.push({
          row: record,
          reason: 'Duplicate username/email/employeeID',
        });
        continue;
      }

      const user = new this.userModel({
        fullName,
        username,
        email,
        employeeID,
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

  async findAll(): Promise<User[]> {
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
    console.log(dataUser.length);

    try {
      for (const user of dataUser) {
        try {
          console.log(`🔄 Importing user: ${user.name} (${user.employee_hik})`);
          const exists = await this.userExists(user.employee_hik);
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
            employeeID: user.employeeNo,
            employee_hik: user.employeeNo,
            fullName: user.name,
            username: user.employeeNo,
            password: '123123',
            face_hik: user.faceURL ?? '',
            email: `${user.employeeNo}@gmail.com`,
            gender: user.gender,
            role: user.userType == 'admin' ? Role.ADMINISTRATOR : Role.STAFF,
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
      console.log(`🗑 Deleting user with employeeID: ${employee_hik}`);
      const deleted = await this.userModel.deleteOne({ employee_hik });
      if (deleted.deletedCount > 0) {
        console.log(
          `✅ User with employeeID ${employee_hik} deleted successfully.`,
        );
      } else {
        console.warn(`⚠️ No user found with employeeID: ${employee_hik}`);
      }
    } catch (error) {
      console.error(
        `❌ Error deleting user with employeeID ${employee_hik}:`,
        error,
      );
    }
  }

  async updateIsSyncUser(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { is_sync: 1 });
  }
}
