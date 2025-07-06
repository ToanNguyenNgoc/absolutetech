import { IsNotEmpty, IsOptional } from 'class-validator';

export class SyncFromDeviceDto {
  @IsNotEmpty()
  device_id: string;

  @IsOptional()
  tables: Record<string, any[]>;
}
