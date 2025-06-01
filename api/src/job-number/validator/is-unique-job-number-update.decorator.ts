import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobNumber } from '../schemas/job-number.schema';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueJobNumberUpdateConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(JobNumber.name)
    private readonly jobNumberModel: Model<JobNumber>,
  ) {}

  async validate(code: string, args: ValidationArguments): Promise<boolean> {
    const object = args.object as any;
    const idToExclude = object.id || object._id || null;

    const existing = await this.jobNumberModel.findOne({ code }).exec();

    if (!existing) return true;
    return existing._id.toString() === idToExclude;
  }

  defaultMessage(): string {
    return 'Job Number code must be unique';
  }
}

export function IsUniqueJobNumberUpdate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueJobNumberUpdateConstraint,
    });
  };
}
