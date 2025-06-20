import { IsNotEmpty } from 'class-validator';

export class SyncFromDeviceDto {
  @IsNotEmpty()
  device_id: string;

  @IsNotEmpty()
  scripts: string[];
}
