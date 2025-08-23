/* eslint-disable no-unused-vars */
import moment from 'moment';
import imageError from '@/assets/img/image-placeholder.png'
import { ElLoading, ElMessageBox } from 'element-plus'
import { baseURL } from '@/api/axios';

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


export const formatDateEn = (dateStr) => !dateStr ? '' : moment(dateStr).format('DD-MMM-YY');
export const formatDateTime = (date) => !date ? '' : moment(date).format('YYYY-MM-DD HH:mm');


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