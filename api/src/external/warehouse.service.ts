import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { generateSignature, generateSyncSignature } from 'src/common/utils/hmac.util';

@Injectable()
export class WarehouseService {
  constructor(private readonly httpService: HttpService) { }

  async requestSSOToken(loginName: string): Promise<string> {
    const endpoint: any = `${process.env.WAREHOUSE_API_URL}/api/v1/generate-login-token`;
    const secret: any = process.env.WAREHOUSE_SSO_SECRET;

    const payload = {
      login_name: loginName ?? 'super_admin',
      timestamp: Date.now(),
      nonce: Date.now().toString(36) + Math.random().toString(36).substring(2, 15),
    };

    const signature = generateSignature(payload, secret);

    try {
      const response: any = await firstValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'X-SIGNATURE': signature,
          },
        })
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Laravel SSO Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Unable to get token from Laravel');
    }
  }

  async syncUserToLaravel(action: 'create' | 'update' | 'delete', data: any): Promise<any> {
    const endpoint: any = `${process.env.WAREHOUSE_API_URL}/api/v1/warehouse/sync-user`;
    const secret: any = process.env.WAREHOUSE_SSO_SECRET;

    const timestamp = Date.now().toString();
    const nonce = Date.now().toString(36) + Math.random().toString(36).substring(2, 15);

    const payload = {
      action,
      data,
    };

    const signature = generateSyncSignature(payload, timestamp, nonce, secret);

    try {
      const response: any = await firstValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'X-SIGNATURE': signature,
            'X-TIMESTAMP': timestamp,
            'X-NONCE': nonce,
            'Content-Type': 'application/json',
          },
        })
      );
      return response.data;
    } catch (error) {
      console.error('Laravel Sync User Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to sync user to Laravel');
    }
  }

}
