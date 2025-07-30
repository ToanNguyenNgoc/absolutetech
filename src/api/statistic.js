import axiosInstance from "./axios";

export const StatisticApi={
  users:() => axiosInstance.get('/statistic/users').then(res => res.data),
  timesheets:()=> axiosInstance.get('/statistic/timesheets').then(res => res.data),
}