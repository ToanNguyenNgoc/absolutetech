import {
  Body,
  Controller,
  Get,
  Injectable,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as path from 'path';
import { join } from 'path';
import { existsSync } from 'fs';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeController,
  ApiOkResponse,
} from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import {
  FileUpload,
  FileUploadDocument,
} from 'src/job-number/schemas/file-upload.schema';
import { Model } from 'mongoose';
import { Response } from 'express';
import { PostMediaFromUrl } from './media.dto';

const validatorsFile = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 30000000 }),
    // new FileTypeValidator({ fileType: /^(image|video)\// }),
  ],
});
@Controller('api/media')
@Injectable()
export class MediaController {
  private readonly domain_url = process.env.HOST_SERVER;
  constructor(
    @InjectModel(FileUpload.name)
    private readonly fileUploadModel: Model<FileUploadDocument>,
  ) {}

  @Post()
  @ApiOkResponse({ description: 'Upload media' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            new Date().getTime();
          const extensions = path.parse(file.originalname).ext;
          callback(null, `${filename}${extensions}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile(validatorsFile)
    file: Express.Multer.File,
  ) {
    const response = await this.fileUploadModel.create({
      name: file.fieldname,
      url: file.path,
      original_url: `${this.domain_url}/${file.path}`,
      extension: file.mimetype,
      mime_type: file.mimetype,
      size: file.size,
      type: file.mimetype,
      is_temp: false,
    });
    return response;
  }

  @Post('from_url')
  async postFromUrl(@Body() { from_url }: PostMediaFromUrl) {
    return from_url;
  }
}

@ApiExcludeController()
@Controller('uploads')
export class UploadController {
  @Get(':image_name')
  get(@Param('image_name') image_name: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', image_name);
    if (!existsSync(filePath)) {
      throw new NotFoundException();
    }
    return res.sendFile(filePath);
  }
}
