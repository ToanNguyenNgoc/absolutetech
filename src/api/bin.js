import axiosInstance from "./axios";

export const BinApi = {
  getBins: (params) => axiosInstance.get('/bins', { params }).then(res => res.data),
  getBinConfigures: (params) => axiosInstance.get('/bin-configures', { params }).then(res => res.data),
}