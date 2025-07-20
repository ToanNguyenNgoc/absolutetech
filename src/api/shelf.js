import axiosInstance from "./axios";

export const ShelfApi = {
  get: (params) => axiosInstance.get('/shelfs', { params }).then(res => res.data),
}