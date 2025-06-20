import moment from 'moment';

export class DateUtil {
  static currentDateString(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
}
