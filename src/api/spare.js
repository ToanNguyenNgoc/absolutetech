import axiosInstance from "./axios";

export const SpareApi = {
  get: (params) => axiosInstance.get('/spares', { params }).then(res => res.data),
}