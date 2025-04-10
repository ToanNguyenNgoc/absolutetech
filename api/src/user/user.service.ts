/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { parse } from 'csv-parse';
import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import { Model, Types } from 'mongoose';
import * as path from 'path';
import { paginate } from 'src/common/pagination.util';
import { EntryLogService } from 'src/entry-log/entry-log.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  AcsEventCond,
  ResponseFinger,
  Role,
  UserInfo,
  UserInfoItem,
  UserInfoSearch,
  UserItemRequest,
} from './user.enums';
import { User, UserDocument } from './user.schema';
import { constants } from 'fs/promises';
import { UserFinger } from 'src/user-finger/user-finger.schema';
import { UserFingerService } from 'src/user-finger/user-finger.service';
import { UserModule } from './user.module';
const DigestClient = require('digest-fetch');
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly entryLogService: EntryLogService,
    private readonly userFingerService: UserFingerService,
  ) {}

  async createInfoPersonHIKVISION(data: { UserInfo: UserInfo }) {
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
        `${process.env.HOST_HIKVISION}ISAPI/AccessControl/UserInfo/Record?format=json`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'multipart/x-mixed-replace',
          },
        },
      );
      const result = await res.json();
      console.log('result', result);
      return result;
    } catch (error) {
      console.log('Error', error);
    }
  }

  async uploadFaceInfoHIKVISION(payload: { employId: string; url: string }) {
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
        `${process.env.HOST_HIKVISION}ISAPI/Intelligent/FDLib/FaceDataRecord?format=json`,
        {
          method: 'POST',
          body: JSON.stringify({
            faceLibType: 'blackFD',
            FDID: '1',
            FPID: payload.employId,
            faceURL: payload.url,
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
      const result = await saveFinger.json();
      return result;
    } catch (error) {
      console.error('Error registerFingerHIKVISION:', error);
      throw new Error('Failed to register fingerprint with HIKVISION');
    }
  }
  async deleteUserHIKVISION(data: { employeeNo: string }) {
    try {
      const client = new DigestClient(
        process.env.HIKVISION_USERNAME,
        process.env.HIKVISION_PASSWORD,
        {
          algorithm: 'MD5',
        },
      );
      const res = await client.fetch(
        `${process.env.HOST_HIKVISION}ISAPI/AccessControl/UserInfo/Delete?format=json`,
        {
          method: 'PUT',
          body: JSON.stringify({
            UserInfoDelCond: {
              EmployeeNoList: [{ employeeNo: data.employeeNo }],
            },
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'multipart/x-mixed-replace',
          },
        },
      );
      const result = await res.json();
      console.log('result', result);
      return result;
    } catch (error) {
      console.log('Error', error);
    }
  }
  async deleteFaceUserHik(data: { employeeNo: string }) {
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
        `${process.env.HOST_HIKVISION}ISAPI/Intelligent/FDLib/FDSetUp?format=json`,
        {
          method: 'PUT',
          body: JSON.stringify({
            faceLibType: 'blackFD',
            FDID: '1',
            FPID: data.employeeNo,
            deleteFP: true,
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'multipart/x-mixed-replace',
          },
        },
      );
      const result = await res.json();
      console.log('result', result);
      return result;
    } catch (error) {
      console.log('Error', error);
    }
  }
  async searchInfoHIKVISION(payload: { employId: string }) {
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
        `${process.env.HOST_HIKVISION}ISAPI/AccessControl/UserInfo/Search?format=json`,
        {
          method: 'POST',
          body: JSON.stringify({
            UserInfoSearchCond: {
              searchID: '0',
              searchResultPosition: 0,
              maxResults: 5,
              EmployeeNoList: [
                {
                  employeeNo: payload.employId,
                },
              ],
            },
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
  //save FACE from HIK
  async downloadAndSaveImage(
    client,
    imageUrl: string,
    folder = 'uploads/avatar',
  ) {
    try {
      // 🔹 Kiểm tra URL hợp lệ
      if (!imageUrl.startsWith('http')) {
        throw new Error('URL không hợp lệ');
      }

      // 🔹 Tách tên file và xử lý URL
      const filename = path.basename(imageUrl.split('@')[0]); // Lấy tên file bỏ phần @WEBxxx
      const saveDir = path.join(process.cwd(), folder);
      const savePath = path.join(saveDir, filename);
      const encodedUrl = encodeURI(imageUrl);

      // 🔹 Tạo thư mục nếu chưa có
      // Check if the file exists in the current directory.
      fs.access(saveDir, constants.F_OK, (err) => {
        console.log(`${saveDir} ${err ? 'does not exist' : 'exists'}`);
        if (err) {
          fs.mkdir(saveDir, { recursive: true }, () => {});
        }
      });
      // 🔹 Gửi request tải ảnh bằng DigestClient
      console.log('🔍 Đang tải ảnh từ:', encodedUrl);
      const response = await client.fetch(encodedUrl, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Lỗi tải ảnh: ${response.statusText}`);
      }
      // 🔹 Đọc dữ liệu ảnh và lưu file
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFile(savePath, buffer, (err) => {
        if (err) throw err;
      });
      return `api/${folder}/${filename}`;
    } catch (error) {
      console.error('❌ Lỗi tải ảnh:', error.message);
      return null;
    }
  }
  //save Finger from HIK
  async saveFingerData(client, employeeId: string) {
    try {
      const res = await client.fetch(
        `${process.env.HOST_HIKVISION}ISAPI/AccessControl/FingerPrintUpload?format=json`,
        {
          method: 'POST',
          body: JSON.stringify({
            FingerPrintCond: {
              searchID: employeeId,
              employeeNo: employeeId,
              cardReaderNo: 1,
            },
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'multipart/x-mixed-replace',
          },
        },
      );
      const result: ResponseFinger = await res.json();
      if (result?.FingerPrintInfo?.FingerPrintList?.length > 0) {
        const user = await this.userModel
          .findOne({ employeeID: employeeId })
          .exec();
        if (!user) {
          return;
        }
        await this.userFingerService.createFinger({
          user: user._id as Types.ObjectId,
          finger_data: result.FingerPrintInfo.FingerPrintList[0].fingerData,
          no: result.FingerPrintInfo.FingerPrintList[0].fingerPrintID, // Ép kiểu số rõ ràng
        });
        await this.saveFingerData(client, employeeId);
      }
    } catch (error) {
      return null;
    }
  }

  async userExists(employeeID: string) {
    const user = await this.userModel.findOne({ employeeID }).exec();
    return user;
  }
  // sync from HIK to cloud
  async syncHIKVISION() {
    try {
      const client = new DigestClient(
        process.env.HIKVISION_USERNAME,
        process.env.HIKVISION_PASSWORD,
        {
          algorithm: 'MD5',
        },
      );
      let page: number = 0;
      const limit: number = 30;
      let dataUser: UserInfoItem[] = [];
      do {
        const res = await client.fetch(
          `${process.env.HOST_HIKVISION}ISAPI/AccessControl/UserInfo/Search?format=json`,
          {
            method: 'POST',
            body: JSON.stringify({
              UserInfoSearchCond: {
                searchID: '0',
                searchResultPosition: page * limit,
                maxResults: limit,
              },
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'multipart/x-mixed-replace',
            },
          },
        );

        const result: { UserInfoSearch: UserInfoSearch } = await res.json();
        // Kiểm tra nếu không có UserInfoSearch hoặc UserInfo thì dừng luôn
        if (!result.UserInfoSearch || !result.UserInfoSearch?.UserInfo) {
          break;
        }
        const responseData = result.UserInfoSearch;

        if (responseData?.UserInfo) {
          dataUser = dataUser.concat(responseData.UserInfo);
        }

        // Nếu responseStatusStrg là "OK", thoát khỏi vòng lặp
        if (responseData?.responseStatusStrg === 'OK') {
          break;
        }
        page += 1;
      } while (true);
      for (const user of dataUser) {
        try {
          const exists = await this.userExists(user.employeeNo);
          if (exists) {
            if (user.numOfFP > 0) {
              await this.userFingerService.removeFingersByUser(
                exists._id as Types.ObjectId,
              );
              if (exists.avatar) {
                console.log('deleted.avatar', exists.avatar);
                const avatarPath = exists.avatar.replace(/^\/?api\//, ''); // Xóa dư "api/" ở đầu nếu có
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
              await this.saveFingerData(client, user.employeeNo);
              let pathImage: string | null = null;
              if (user.faceURL) {
                pathImage = await this.downloadAndSaveImage(
                  client,
                  user.faceURL,
                );
              }
              await this.updateUser(exists._id as string, {
                avatar: pathImage ?? exists.avatar ?? '',
              });
            }
            continue;
          }
          let pathImage: string | null = null;
          if (user.faceURL) {
            pathImage = await this.downloadAndSaveImage(client, user.faceURL);
          }
          await this.createUser({
            employeeID: user.employeeNo,
            fullName: user.name,
            password: '123123',
            username: user.employeeNo,
            avatar: pathImage ?? '',
            email: `${user.employeeNo}@gmail.com`,
            gender: user.gender,
            role: user.userType == 'admin' ? Role.ADMINISTRATOR : Role.STAFF,
          });
          if (user.numOfFP > 0) {
            await this.saveFingerData(client, user.employeeNo);
          }
        } catch (error) {
          console.error(`❌ Error importing user ${user.name}:`, error.message);
        }
      }
      return dataUser;
    } catch (error) {
      console.log('Error', error);
    }
  }

  async createUser(dto: Partial<User>) {
    const hashed = await bcrypt.hash(dto.password ?? '', 10);
    const created = new this.userModel({
      ...dto,
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
    if (dto.avatar) {
      await this.uploadFaceInfoHIKVISION({
        employId: id,
        url: `${process.env.HOST_SERVER}/${dto.avatar}`,
      });
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
      await this.deleteFaceUserHik({ employeeNo: id });
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
    await this.deleteUserHIKVISION({ employeeNo: id });
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
              await this.userModel
                .findOne({
                  avatar: user.faceURL ?? exists.avatar ?? '',
                  _id: { $ne: exists._id },
                })
                .exec();
            }
            continue;
          }

          const res = await this.createUser({
            employeeID: user.employeeNo,
            fullName: user.name,
            password: '123123',
            username: user.employeeNo,
            avatar: user.faceURL ?? '',
            email: `${user.employeeNo}@gmail.com`,
            gender: user.gender,
            role: user.userType == 'admin' ? Role.ADMINISTRATOR : Role.STAFF,
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
}
