// src/api/jobnumber.js
import axiosInstance from './axios';

export function getJobNumbers(page, limit) {
  return axiosInstance.get('/job-numbers', {
    params: { page, limit },
  });
}

export function deleteJobNumber(id) {
  return axiosInstance.delete(`/job-numbers/${id}`);
}

export function createJobNumber(payload) {
  return axiosInstance.post('/job-numbers', payload);
}

export function uploadJobFile(formData) {
  return axiosInstance.post('/job-numbers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getJobNumberById(id) {
  return axiosInstance.get(`/job-numbers/${id}`);
}

export function updateJobNumber(id, payload) {
  return axiosInstance.put(`/job-numbers/${id}`, payload);
}
