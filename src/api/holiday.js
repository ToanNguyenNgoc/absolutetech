import axiosInstance from "./axios";

export const HolidayApi = {
  get: (params) => axiosInstance.get('/holidays', { params }).then(res => res.data),
  post: (body) => axiosInstance.post('/holidays', body).then(res => res.data),
  put: (id, body) => axiosInstance.put(`/holidays/${id}`, body).then(res => res.data),
  delete: (id) => axiosInstance.delete(`/holidays/${id}`).then(res => res.data),
}