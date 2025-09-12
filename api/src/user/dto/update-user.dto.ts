import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Role } from '../user.enums';
import { Transform, Type } from 'class-transformer';
import { UserSettingSalaryDto } from './create-user.dto';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  // @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  employee_id?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsOptional()
  position?: string;

  // @IsEnum(Gender)
  @IsOptional()
  gender?: string;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  avatar?: any;

  @IsOptional()
  @IsString()
  @Transform(({ obj }) => obj.nric_fin ?? obj.nric_fin)
  nric_fin?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ obj }) => obj.work_permit_expiry ?? obj.work_permit_expiry)
  work_permit_expiry?: Date;

  @ValidateNested()
  @IsOptional()
  @Type(() => UserSettingSalaryDto)
  user_setting_salary?: UserSettingSalaryDto;
}
