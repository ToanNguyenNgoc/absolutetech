import moment from 'moment';

export class DateUtil {
  static currentDateString(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Tính khoảng thời gian giữa 2 chuỗi "HH:mm" và trả về số giờ dưới dạng thập phân
   * @param {string} timeStart - Thời gian bắt đầu, vd: "22:00"
   * @param {string} timeEnd - Thời gian kết thúc, vd: "06:30"
   * @returns {number} - Số giờ, ví dụ: 8.5
   */
  static calculateHHmmDuration(timeStart: string, timeEnd: string) {
    if (!/^\d{2}:\d{2}$/.test(timeStart) || !/^\d{2}:\d{2}$/.test(timeEnd))
      return 0;

    const [startH, startM] = timeStart.split(':').map(Number);
    const [endH, endM] = timeEnd.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    // Nếu qua ngày hôm sau
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    const diffMinutes = endTotal - startTotal;
    return +(diffMinutes / 60).toFixed(2); // Giữ 2 chữ số sau dấu thập phân
  }
}
