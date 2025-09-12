/* eslint-disable no-unused-vars */
import moment from 'moment';
import imageError from '@/assets/img/image-placeholder.png'
import { ElLoading, ElMessageBox } from 'element-plus'
import { baseURL } from '@/api/axios';
import { WEEKDAYS } from './constants';

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};

export const formatTime = (_, __, cellValue) => {
  if (!cellValue) return '';

  if (typeof cellValue === 'string' && cellValue.match(/^\d{4}-\d{2}-\d{2}T/)) {
    const date = new Date(cellValue);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  if (typeof cellValue === 'string' && cellValue.match(/^\d{2}:\d{2}$/)) {
    const date = new Date(`2000-01-01T${cellValue}:00`);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  return '';
}


export const formatDateEn = (dateStr) => !dateStr ? '' : moment().utc(dateStr).local().format('DD-MMM-YY');
export const formatDateTime = (date) => !date ? '' : moment().utc(date).local().format('YYYY-MM-DD HH:mm');
export const formatDateLocal = (date) => !date ? '' : moment().utc(date).local().format('YYYY-MM-DD');

/**
 * Format ISO time string to local time in HH:mm format
 * If input is already HH:mm, return it as is.
 * If input is empty or invalid, return "00:00"
 *
 * @param {string} isoString
 * @returns {string}
 */
export const formattedTime = (isoString) => {
  if (!isoString) return '00:00';
  if (/^\d{2}:\d{2}$/.test(isoString)) return isoString;

  const m = moment.utc(isoString);
  return m.isValid() ? m.local().format('HH:mm') : '00:00';
};

/**
 * Convert HH:mm (local time) + baseDate → ISO string in UTC
 * @param {string} timeStr - Time in HH:mm format (e.g., "05:30")
 * @param {string|Date} baseDate - Date reference (e.g., "2025-08-03")
 * @returns {string|null} UTC ISO String (e.g., "2025-08-02T22:30:00.000Z")
 */
export const parseTimeToISO = (timeStr, baseDate) => {
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

  const localDate = moment(baseDate); // local day reference
  const [hour, minute] = timeStr.split(':').map(Number);

  // Create a moment in local time
  const localMoment = moment(localDate)
    .set({ hour, minute, second: 0, millisecond: 0 });

  // Convert to UTC ISO string
  return localMoment.utc().toISOString();
}

/**
 * Tính số giờ giữa time_in và time_out
 * @param {string} timeInISO - Thời gian bắt đầu (ISO string - UTC)
 * @param {string} timeOutISO - Thời gian kết thúc (ISO string - UTC)
 * @returns {number} - Số giờ (thập phân), làm tròn 2 chữ số
 */
export const calculateDurationHours = (timeInISO, timeOutISO) => {
  if (!timeInISO || !timeOutISO) return 0;
  const start = moment.utc(timeInISO);
  const end = moment.utc(timeOutISO);
  const duration = moment.duration(end.diff(start));
  const hours = duration.asHours();
  return hours >= 0 ? Number(hours.toFixed(2)) : Number(duration.add(1, 'day').asHours().toFixed(2));
}

/**
 * Trả về tên thứ trong tuần dạng in hoa (MONDAY, TUESDAY, ...)
 * @param {string} isoDate - ISO string (UTC)
 * @returns {string} - Tên thứ tiếng Anh viết hoa
 */
export const getWeekdayNameUpper = (isoDate) => {
  const dayNames = Object.values(WEEKDAYS);
  const date = new Date(isoDate);
  return dayNames[date.getUTCDay()];
}

/**
 * Trả về tên thứ trong tuần dạng in hoa (MONDAY, TUESDAY, ...)
 * @param {string} dateStr - Format: YYYY-MM-DD
 * @returns {string} - Tên thứ tiếng Anh viết hoa
 */
export const getWeekday = (dateStr) => {
  const dayNames = Object.values(WEEKDAYS);
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return dayNames[date.getUTCDay()];
};


export class AppLoading {
  static instance = null

  static show(options = {}) {
    if (!AppLoading.instance) {
      AppLoading.instance = ElLoading.service({
        fullscreen: true,
        lock: true,
        background: '',
        ...options,
      })
    }
  }

  static hide() {
    if (AppLoading.instance) {
      AppLoading.instance.close()
      AppLoading.instance = null
    }
  }

  static isLoading() {
    return !!AppLoading.instance
  }
}

export class AppConfirm {
  static open({ title = 'Confirm action', callback = () => null }) {
    ElMessageBox.confirm(
      `<p>${title}</p>`,
      'Confirm',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        dangerouslyUseHTMLString: true,
      }
    )
      .then(async () => {
        callback();
      })
      .catch(() => {
      });
  }

  static delete({ callback = () => null }) {
    return ElMessageBox.confirm(
      '<p>Do you want to delete this item?',
      'Delete Item',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        customClass: 'delete-confirm-box',
        dangerouslyUseHTMLString: true,
      }
    )
      .then(async () => {
        callback();
      })
      .catch(() => {
      })
  }
}


export const getIndexTable = (page = 1, limit = 1, $index = 1) => ((page - 1) * limit) + ($index + 1);

export const removeNullUn = (obj) => {
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

export const getFileUrl = (url) => `${baseURL}/${url}`;
export const onErrorImage = (e) => {
  e.target.src = imageError;
  e.target.style.objectFit = "contain";
}
export const renderBinLocation = (bin) => {
  if (!bin) return;
  return `${bin?.cluster?.name} - ${bin?.shelf?.name} - ${bin?.row} - ${bin?.bin}`
}
export const toUpperCaseFirstText = (text = '') => {
  if (text.trim().length == 0) return;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export const calculateDaysBetween = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return 0;
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const diffTime = endDate - startDate;
  return diffTime / (1000 * 60 * 60 * 24);
}
export const formatCurrency = (value) => {
  if (!value && value !== 0) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const parseCurrency = (value) => {
  return value.replace(/,/g, '')
}