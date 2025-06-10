import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { generateSignature } from 'src/common/utils/hmac.util';

@Injectable()
export class WarehouseService {
  constructor(private readonly httpService: HttpService) {}

  async requestSSOToken(loginName: string): Promise<string> {
    const endpoint: any = process.env.WAREHOUSE_API_URL;
    const secret: any = process.env.WAREHOUSE_SSO_SECRET;

    const payload = {
      login_name: loginName ?? 'super_admin',
      timestamp: Date.now(),
    };

    const signature = generateSignature(payload, secret);
    console.log('Generated Signature:', signature);

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
}
