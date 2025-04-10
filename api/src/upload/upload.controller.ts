import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';

@Controller('api/upload')
export class UploadController {
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'avatars');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Giữ tên gốc
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    console.log('Received upload request');
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const uploadPath = join(process.cwd(), 'uploads', 'avatars');
    const fullPath = join(uploadPath, file.originalname);

    // Check file đã tồn tại
    if (fs.existsSync(fullPath)) {
      console.log('File đã tồn tại, không lưu nữa');
      return {
        success: true,
        url: `api/uploads/avatars/${file.originalname}`,
        existed: true,
      };
    }

    // Nếu file chưa tồn tại → cho phép lưu
    fs.writeFileSync(fullPath, fs.readFileSync(file.path)); // copy file tạm vào đúng chỗ
    console.log(`File saved: ${file.originalname}, size: ${file.size} bytes`);

    return {
      success: true,
      url: `api/uploads/avatars/${file.originalname}`,
      existed: false,
    };
  }
}
