// job-number.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { JobNumberService } from './job-number.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/user.enums';
import { CreateJobNumberDto } from './dto/create-job-number.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UpdateJobNumberDto } from './dto/update-job-number.dto';

@Controller('/api/job-numbers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobNumberController {
  constructor(private readonly jobNumberService: JobNumberService) { }

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.TECHNICIAN)
  async create(@Body() dto: CreateJobNumberDto, @Request() req) {
    const userId = req.user.userId;
    return this.jobNumberService.create({ ...dto, createdBy: userId });
  }

  @Get(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.TECHNICIAN)
  async getDetail(@Param('id') id: string) {
    return this.jobNumberService.getDetailById(id);
  }


  @Get()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.TECHNICIAN)
  async findAllPaginated(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.jobNumberService.findAllPaginated(page, limit);
  }

  @Post('upload')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.TECHNICIAN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'job-files'),
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const fileName = `${Date.now()}${fileExtName}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    return this.jobNumberService.handleFileUpload(file);
  }
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async delete(@Param('id') id: string) {
    return this.jobNumberService.deleteJobNumber(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateJobNumberDto, @Request() req) {
    console.log('Updating job number with ID:', id);
    const userId = req.user.userId;
    return this.jobNumberService.update(id, {
      ...dto,
      id,
      createdBy: userId,
    });
  }

}
