import axiosInstance from "./axios";

export function uploadFile(payload) {
  return axiosInstance.post("/upload/avatar", payload);
}
