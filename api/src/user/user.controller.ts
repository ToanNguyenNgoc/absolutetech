import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, UserInfo } from './user.enums';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { convertToCSV } from 'src/common/csv.util';

@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user-face')
  async createUserFace(@Body() data: { UserInfo: UserInfo }) {
    return await this.userService.createInfoPersonHIKVISION(data);
  }

  @Post('upload-user-face')
  uploadUserFace(@Body() data: { employId: string; url: string }) {
    try {
      return this.userService.uploadFaceInfoHIKVISION(data);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('get-event-by')
  async getEventByTime(
    @Body()
    data: {
      searchID: string;
      searchResultPosition: number;
      maxResults: number;
      major: number;
      minor: number;
      startTime: Date;
      endTime: Date;
    },
  ) {
    return await this.userService.getEventByTimeHIKVISION(data);
  }

  @Post('register-finger')
  async registerFinger(
    @Body()
    data: {
      fingerNo: number;
      employeeNo: string;
    },
  ) {
    return await this.userService.registerFingerHIKVISION(data);
  }

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async findAllPaginated(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.userService.findAllPaginated(page, limit);
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('import-file')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const fileName = `${Date.now()}${fileExtName}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async importUsersFromFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.userService.importUsersFromCsv(file.path);
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('export')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async exportUsers(@Res() res: Response) {
    const users = await this.userService.findAll();

    const exportUsers = users.map((user: any) => {
      const obj = typeof user.toObject === 'function' ? user.toObject() : user;
      const { password, ...rest } = obj;
      return rest;
    });

    const csv = convertToCSV(exportUsers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  }
}
