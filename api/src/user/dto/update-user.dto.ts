import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Gender, Role } from '../user.enums';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  employeeID?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsOptional()
  position?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

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
  @Transform(({ obj }) => obj.nric_fin ?? obj.nricFin)
  nricFin?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ obj }) => obj.work_permit_expiry ?? obj.workPermitExpiry)
  workPermitExpiry?: Date;
}
