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
import { JobNumberQr } from './dto/job-number-query.dto';

@Controller('/api/job-numbers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobNumberController {
  constructor(private readonly jobNumberService: JobNumberService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  async create(@Body() dto: CreateJobNumberDto, @Request() req) {
    const userId = req.user.userId;
    return this.jobNumberService.createOne({ ...dto, created_by: userId });
  }

  @Get(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  async getDetail(@Param('id') id: string) {
    return this.jobNumberService.getDetailById(id);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  async findAllPaginated(@Query() qr: JobNumberQr) {
    return this.jobNumberService.findAllPaginated(qr);
  }

  @Post('upload')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJobNumberDto,
    @Request() req,
  ) {
    console.log('Updating job number with ID:', id);
    const userId = req.user.userId;
    return this.jobNumberService.updateOne(id, {
      ...dto,
      id,
      created_by: userId,
    });
  }
}
