import axiosInstance from "./axios";

export const TransactionApi = {
  get: (params) => axiosInstance.get('/transactions', { params }).then(res => res.data),
  getDetail:(id) => axiosInstance.get(`/transactions/${id}`).then(res => res.data),
}