/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { paginate } from 'src/common/pagination.util';
import { EntryLogService } from 'src/entry-log/entry-log.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfo } from './user.enums';
import { User, UserDocument } from './user.schema';
const DigestClient = require('digest-fetch');
import * as FormData from 'form-data';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly entryLogService: EntryLogService,
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
      console.log(res);

      const result = await res.json();
      console.log('result', result);
      return result;
    } catch (error) {
      console.log('Error', error);
    }
  }

  async uploadFaceInfoHIKVISION(
    data: { FPID: string },
    file: Express.Multer.File,
  ) {
    try {
      const form = new FormData();
      form.append(
        'FaceDataRecord',
        JSON.stringify({ faceLibType: 'blackFD', FDID: '1', FPID: data.FPID }),
      );
      const absolutePath = path.resolve(
        __dirname,
        '..',
        'uploads',
        file.filename,
      );
      console.log('Absolute Path:', absolutePath);

      // form.append('img', fs.createReadStream(absolutePath), {
      //   filename: file.originalname,
      //   contentType: file.mimetype,
      // });
      const client = new DigestClient(
        process.env.HIKVISION_USERNAME,
        process.env.HIKVISION_PASSWORD,
        { algorithm: 'MD5' },
      );

      const res = await client.fetch(
        `${process.env.HOST_HIKVISION}ISAPI/Intelligent/FDLib/FDSetUp?format=json`,
        {
          method: 'PUT',
          body: form,
          headers: form.getHeaders(), // ✅ LẤY ĐÚNG HEADERS CÓ BOUNDARY
        },
      );

      // const result = await res.text(); // hoặc res.json() tùy API trả về
      console.log('result', res);
      return true;
    } catch (error) {
      console.log('Error', error);
    }
  }
  async createUser(dto: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({
      ...dto,
      password: hashed,
    });
    return created.save();
  }

  async findAllPaginated(page = 1, limit = 10) {
    return paginate(this.userModel, page, limit, {}, { password: 0 });
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
      const filePath = path.join(__dirname, '..', '..', deleted.avatar);
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
}
