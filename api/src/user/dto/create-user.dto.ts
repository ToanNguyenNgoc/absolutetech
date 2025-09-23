import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Role } from '../user.enums';
import { IsUniqueUser } from '../validators/is-unique-user.decorator';
import { Transform, Type } from 'class-transformer';

export class UserSettingSalaryDto {
  @IsNumber()
  basic_salary: number;

  @IsNumber()
  @IsOptional()
  allowance_monthly: number;

  @IsNumber()
  @IsOptional()
  allowance_on_rope: number;

  @IsNumber()
  @IsOptional()
  allowance_indoor: number;

  @IsNumber()
  @IsOptional()
  allowance_night_job: number;

  @IsNumber()
  @IsOptional()
  allowance_training: number;

  @IsNumber()
  @IsOptional()
  allowance_shipyard_smaller_5_hours: number;

  @IsNumber()
  @IsOptional()
  allowance_shipyard_greater_5_hours: number;

  @IsNumber()
  @IsOptional()
  allowance_others: number;

  @IsNumber()
  @IsOptional()
  overtime_1_5: number;

  @IsNumber()
  @IsOptional()
  overtime_2_0: number;

  @IsNumber()
  @IsOptional()
  levy: number;

  @IsNumber()
  @IsOptional()
  allowance_overseas_weekday: number;
}
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @IsUniqueUser({ message: 'Username already exists' })
  username: string;

  @IsOptional()
  // @IsUniqueUser({ message: 'Employee ID already exists' })
  employee_id?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsOptional()
  position?: string;

  // @IsEnum(Gender)
  // @IsOptional()
  // gender?: Gender;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;

  // @IsEmail()
  // @IsUniqueUser({ message: 'Email already exists' })
  // email?: string;

  @IsString()
  @IsOptional()
  password: string;

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
