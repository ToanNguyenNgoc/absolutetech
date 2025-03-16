import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/user.enums';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/upload')
export class UploadController {

  constructor(private readonly configService: ConfigService) {}

  @Post('avatar')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'avatars');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const fileExtName = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExtName}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `uploads/avatars/${file.filename}`,
    };
  }
}
