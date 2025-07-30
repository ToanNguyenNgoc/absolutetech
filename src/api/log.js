import axiosInstance from "./axios";

export const LogApi={
  getSyncDataLogs:(params)=> axiosInstance.get('/sync-data-logs',{params}).then(res => res.data),
}