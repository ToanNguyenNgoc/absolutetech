import axiosInstance from "./axios";

export const ReplenishApi = {
  getBinConfigures: (params) => axiosInstance.get('/replenish/bin-configures', { params }).then(res => res.data),
  postBinConfigures: (data) => axiosInstance.post('/replenish/bin-configures', data).then(res => res.data),
}