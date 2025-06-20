import { IsOptional } from 'class-validator';

export class SyncDataCreateDto {
  @IsOptional()
  data: string;

  @IsOptional()
  device_id: string;

  @IsOptional()
  timestamp_fetch?: string;

  @IsOptional()
  timestamp_push?: string;
}
