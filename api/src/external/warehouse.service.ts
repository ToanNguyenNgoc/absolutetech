import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WarehouseService {
  constructor(private readonly httpService: HttpService) {}

  async requestSSOToken(loginName: string): Promise<string> {
    const endpoint: any = process.env.WAREHOUSE_API_URL;
    const secret = process.env.WAREHOUSE_SSO_SECRET;

    try {
      const response: any = await firstValueFrom(
        this.httpService.post(endpoint, {
          login_name: 'super_admin',
        }, {
          headers: {
            'X-SYSTEM-KEY': secret,
          }
        })
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Laravel SSO Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Unable to get token from Laravel');
    }
  }
}
