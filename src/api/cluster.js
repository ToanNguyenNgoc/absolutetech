import axiosInstance from "./axios";

export const ClusterApi = {
  get: (params) => axiosInstance.get('/clusters', { params }).then(res => res.data),
}