import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Gender, Role } from '../user.enums';
import { IsUniqueUser } from '../validators/is-unique-user.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsUniqueUser({ message: 'Username already exists' })
  username: string;

  @IsNotEmpty()
  @IsUniqueUser({ message: 'Employee ID already exists' })
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

  @IsEmail()
  @IsUniqueUser({ message: 'Email already exists' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  avatar?: any;
}
