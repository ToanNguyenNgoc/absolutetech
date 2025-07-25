import axiosInstance from "./axios";

export const SpareApi = {
  get: (params) => axiosInstance.get('/spares', { params }).then(res => res.data),
  post: (data) => axiosInstance.post('/spares', data).then(res => res.data),
  update: (id, data) => axiosInstance.put(`/spares/${id}`, data).then(res => res.data),
  delete: (id) => axiosInstance.delete(`/spares/${id}`).then(res => res.data),
}