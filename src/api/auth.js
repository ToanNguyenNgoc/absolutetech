import axiosInstance from "./axios";

export function login(payload) {
  return axiosInstance.post("/auth/login", payload);
}

export function info() {
  return axiosInstance.get("/auth/info");
}

export function changePassword(payload) {
  return axiosInstance.post("/auth/change-password", payload);
}

export async function getSSOToken(loginName) {
    return axiosInstance.post("/auth/sso/generate-token", { login_name: loginName });
}