import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { JobNumber } from '../schemas/job-number.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isUniqueJobNumber', async: true })
@Injectable()
export class IsUniqueJobNumberConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(JobNumber.name)
    private readonly jobNumberModel: Model<JobNumber>,
  ) {}

  async validate(code: string, _args: ValidationArguments): Promise<boolean> {
    const exists = await this.jobNumberModel.exists({ code });
    return !exists;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Job Number code already exists';
  }
}

export function IsUniqueJobNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueJobNumberConstraint,
    });
  };
}
