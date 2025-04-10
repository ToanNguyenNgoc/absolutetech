import { Controller, Headers, Post, Req, Res } from '@nestjs/common';
// import * as Busboy from 'busboy';
import { Request, Response } from 'express';

const eventCache = new Map<string, { serialNo: number; dateTime: string }>();

@Controller('api/hikvision')
export class HikvisionController {
  @Post('listening')
  receiveAlarm(@Req() req: Request, @Res() res: Response, @Headers() headers) {
    // console.log('Received Alarm Event!');
    // console.log('Content-Type:', headers['content-type']);
    // const busboy = Busboy({ headers });
    // busboy.on('field', (fieldname, value) => {
    //   console.log(`Receiving field: ${fieldname}`);
    //   if (fieldname === 'event_log') {
    //     try {
    //       const event = JSON.parse(value);
    //       const deviceId =
    //         event?.AccessControllerEvent?.deviceName?.trim() ||
    //         event?.ipAddress;
    //       const serialNo = event?.AccessControllerEvent?.serialNo;
    //       const dateTime = event?.dateTime;
    //       if (!deviceId || serialNo === undefined || !dateTime) {
    //         console.warn('Invalid event data. Skipping.');
    //         return;
    //       }
    //       const lastEvent = eventCache.get(deviceId);
    //       if (
    //         lastEvent &&
    //         lastEvent.serialNo === serialNo &&
    //         lastEvent.dateTime === dateTime
    //       ) {
    //         console.log(`[${deviceId}] Duplicate event detected. Skipping...`);
    //         return;
    //       }
    //       // Cập nhật cache
    //       eventCache.set(deviceId, { serialNo, dateTime });
    //       console.log(
    //         `[${deviceId}] New event received:`,
    //         JSON.stringify(event, null, 2),
    //       );
    //       if (
    //         event.eventType === 'AccessControllerEvent' &&
    //         event.AccessControllerEvent?.subEventType === 75 &&
    //         event.AccessControllerEvent?.currentVerifyMode !== 'invalid'
    //       ) {
    //         console.log(
    //           '✅ Xác thực thành công:',
    //           event.AccessControllerEvent.name,
    //         );
    //         // Xử lý điểm danh, mở cửa, ghi log...
    //       } else {
    //         console.log(
    //           '❌ Bỏ qua event thất bại hoặc không đúng:',
    //           event.AccessControllerEvent?.subEventType,
    //         );
    //       }
    //       // TODO: Xử lý event thật ở đây (ví dụ ghi DB, gửi message...)
    //     } catch (err) {
    //       console.error('JSON parse error:', err);
    //     }
    //   }
    // });
    // busboy.on('file', (fieldname, file) => {
    //   console.log(`Unexpected file field: ${fieldname}`);
    //   file.resume(); // Bỏ qua file nếu có
    // });
    // busboy.on('finish', () => {
    //   console.log('Finished parsing form!');
    //   res.status(200).send('OK'); // <--- Cần trả response ở đây!
    // });
    // req.pipe(busboy);
  }
}
