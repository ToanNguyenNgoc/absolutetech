import axiosInstance from "./axios";

export const TransactionApi = {
  get: (params) => axiosInstance.get('/transactions', { params }).then(res => res.data),
}