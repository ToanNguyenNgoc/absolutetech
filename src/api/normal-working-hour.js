import axiosInstance from "./axios";

export const NormalWorkingHourApi = {
  get:(params) => axiosInstance.get('/normal-working-hours', params).then(res => res.data),
  update:(id, body) => axiosInstance.put(`/normal-working-hours/${id}`, body).then(res => res.data),
};