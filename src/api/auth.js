import axiosInstance from './axios';

export function login(payload) {
  return axiosInstance.post('/auth/login', payload);
}

export function info() {
  return axiosInstance.get("/auth/info");
}