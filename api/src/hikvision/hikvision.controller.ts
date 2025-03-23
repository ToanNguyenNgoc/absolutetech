import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('api/hikvision')
export class HikvisionController {
  @Post('event')
  async hikvision(@Req() request: Request): Promise<string> {
    const contentType = request.headers['content-type'];
    console.log('Content-Type:', contentType);

    const rawData = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      request.on('data', (chunk) => chunks.push(chunk));
      request.on('end', () => resolve(Buffer.concat(chunks)));
      request.on('error', (err) => reject(err));
    });

    if (!rawData || rawData.length === 0) {
      console.error('No data received from Hikvision');
      return 'OK';
    }

    const rawString = rawData.toString('utf-8');
    let parsedData: any;

    try {
      if (contentType?.includes('application/json')) {
        parsedData = JSON.parse(rawString);
      } else if (contentType?.includes('multipart/form-data')) {
        const jsonMatch = rawString.match(/{[\s\S]*}/);
        if (!jsonMatch) {
          console.error('No JSON found in multipart data');
          return 'OK';
        }
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        console.error('Unsupported Content-Type:', contentType);
        return 'OK';
      }

      console.log('Parsed JSON data:', JSON.stringify(parsedData, null, 2));

      // Tìm Employment ID
      const possibleFields = ['employeeID', 'userID', 'staffID', 'personID'];
      let employmentId: string | undefined;
      for (const field of possibleFields) {
        employmentId =
          parsedData[field] || parsedData.AccessControllerEvent?.[field];
        if (employmentId) break;
      }

      if (employmentId) {
        console.log('Employment ID found:', employmentId);
      } else {
        console.warn(
          'No Employment ID found. Event type:',
          parsedData.eventType,
        );
      }

      return 'OK';
    } catch (error) {
      console.error('Error processing Hikvision data:', error.message);
      return 'OK';
    }
  }
}
