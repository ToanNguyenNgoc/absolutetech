import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Gender, Role } from '../user.enums';
import { IsUniqueUser } from '../validators/is-unique-user.decorator';
import { Transform, Type } from 'class-transformer';

export class UserSettingSalaryDto {
  @IsNumber()
  basic_salary: number;

  @IsNumber()
  @IsOptional()
  base_allowance: number;

  @IsNumber()
  @IsOptional()
  job_allowance: number;

  @IsNumber()
  @IsOptional()
  overtime: number;
}
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @IsUniqueUser({ message: 'Username already exists' })
  username: string;

  @IsNotEmpty()
  @IsUniqueUser({ message: 'Employee ID already exists' })
  employee_id?: string;

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

  @IsEmail()
  @IsUniqueUser({ message: 'Email already exists' })
  email?: string;

  @IsString()
  @IsNotEmpty()
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
