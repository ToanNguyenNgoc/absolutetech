import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
  import { UserService } from '../user.service';
  
  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsUniqueUserConstraint implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {}
  
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
      const property = args.property; // e.g. 'username' or 'email'
      const user = await this.userService.findOneByField(property, value);
      return !user;
    }
  
    defaultMessage(args: ValidationArguments) {
      return `${args.property} already exists`;
    }
  }
  
  export function IsUniqueUser(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsUniqueUserConstraint,
      });
    };
  }
  