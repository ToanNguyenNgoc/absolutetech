/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { convertToCSV } from 'src/common/csv.util';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, UserItemRequest } from './user.enums';
import { UserService } from './user.service';

@Controller('api/users')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('import-data')
  async importListUser(@Body() data: UserItemRequest[]) {
    return await this.userService.importUsers(data ?? []);
  }

  @Post('update-is-sync-user')
  async getAllUsersNotSync() {
    return this.userService.getAllUsersNotSync();
  }

  @Post('delete-user-by-employee')
  async deleteUserByEmployee(@Body() data: { employeeNo: string }) {
    return this.userService.deleteUserByEmployee(data.employeeNo);
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
