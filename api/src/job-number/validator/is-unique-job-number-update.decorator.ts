import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobNumber } from '../schemas/job-number.schema';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueJobNumberUpdateConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(JobNumber.name)
    private jobNumberModel: Model<JobNumber>,
  ) { }

  async validate(code: string, args: ValidationArguments): Promise<boolean> {
    const idToExclude = (args.object as any).id;

    const job = await this.jobNumberModel.findOne({ code });
    if (!job) return true;
    return job._id.toString() === idToExclude;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Job Number code must be unique';
  }
}

export function IsUniqueJobNumberUpdate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueJobNumberUpdate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueJobNumberUpdateConstraint,
    });
  };
}
