import moment from 'moment';

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

import { ElLoading, ElMessageBox } from 'element-plus'

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
      '<p>Do you want to delete this item?</p> All related data will also be deleted.',
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


export const getIndexTable = (page = 1, limit = 1, $index = 1) => ((page - 1) * limit) + ($index + 1)
