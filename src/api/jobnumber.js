// src/api/jobnumber.js
import { removeNullUn } from '@/utils/common';
import axiosInstance from './axios';

export function getJobNumbers(params) {
  return axiosInstance.get('/job-numbers', {params});
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

export function getJobNumberById(id, params) {
  console.log(removeNullUn(params));
  return axiosInstance.get(`/job-numbers/${id}`, {params});
}

export function updateJobNumber(id, payload) {
  return axiosInstance.put(`/job-numbers/${id}`, payload);
}
