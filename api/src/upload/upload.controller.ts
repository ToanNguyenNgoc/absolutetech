import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/user.enums';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';

const MAX_SIZE = 200 * 1024; // 200KB
const TARGET_SIZE = 200 * 1024; // Mục tiêu khoảng 190KB

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
          cb(null, file.originalname); // Giữ nguyên tên file
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only JPG, JPEG, PNG files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const filePath = join(process.cwd(), 'uploads', 'avatars', file.filename);

    try {
      // 🟢 Kiểm tra dung lượng file gốc
      const originalSize = (await fs.stat(filePath)).size;
      console.log('📌 Original Size:', originalSize, 'bytes');

      // ✅ Nếu nhỏ hơn 200KB thì giữ nguyên
      if (originalSize <= MAX_SIZE) {
        console.log('✅ No need to resize');
        return { url: `api/uploads/avatars/${file.filename}` };
      }

      // 🔄 Resize ảnh về chiều rộng tối đa 500px, giảm dần chất lượng
      let quality = 90; // Bắt đầu với chất lượng cao
      let optimizedBuffer = await fs.readFile(filePath); // ✅ Gán giá trị ban đầu
      let resizedSize = originalSize;

      while (resizedSize > TARGET_SIZE && quality > 10) {
        optimizedBuffer = await sharp(filePath)
          .resize({ width: 500, fit: 'contain' }) // Giảm kích thước về 500px
          .jpeg({ quality }) // Giảm chất lượng JPEG
          .toBuffer();

        resizedSize = optimizedBuffer.length;
        console.log(`🎯 Trying quality ${quality}: ${resizedSize} bytes`);

        if (resizedSize < TARGET_SIZE) break; // Đạt mục tiêu thì dừng
        quality -= 5; // Giảm chất lượng nếu còn lớn
      }

      // 🟢 Ghi đè file đã nén
      await fs.writeFile(filePath, optimizedBuffer);
      console.log('✅ Final Size:', resizedSize, 'bytes');

      return {
        url: `api/uploads/avatars/${file.filename + new Date().valueOf()}`,
      };
    } catch (error) {
      console.error('❌ Error resizing image:', error);
      throw new Error('Failed to process image');
    }
  }
}
