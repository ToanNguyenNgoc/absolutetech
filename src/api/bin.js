import axiosInstance from "./axios";

export const BinApi = {
  getBins: (params) => axiosInstance.get('/bins', { params }).then(res => res.data),

  getBinConfigures: (params) => axiosInstance.get('/bin-configures', { params }).then(res => res.data),
  createBinConfigure: (data) => axiosInstance.post('/bin-configures', data).then(res => res.data),
  updateBinConfigure: (id, data) => axiosInstance.put(`/bin-configures/${id}`, data).then(res => res.data),
}