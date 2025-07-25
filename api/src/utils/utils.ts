/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { omit } from 'lodash';

/* eslint-disable @typescript-eslint/no-unused-vars */
export class Utils {
  static removeNullUn(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          typeof value === 'string' &&
          value.trim() !== '',
      ),
    );
  }

  static convertBoolean(obj: Record<string, any>) {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      const value = obj[key];
      if (value === 'true') {
        newObj[key] = true;
      } else if (value === 'false') {
        newObj[key] = false;
      } else if (!isNaN(value) && value !== '') {
        newObj[key] = Number(value);
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  }

  static cleanQuery(obj: any) {
    const query = omit(obj, ['page', 'limit', 'sort', 'search']);
    return Utils.convertBoolean(Utils.removeNullUn(query));
  }
}
