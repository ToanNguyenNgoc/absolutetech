import axiosInstance from './axios';

export const IssuingApi = {
  post:(data) => axiosInstance.post('/issuing', data).then(res => res.data),
}