import axiosInstance from "./axios";

export function createFinger(payload) {
  return axiosInstance.post("/finger/register-finger", payload);
}
