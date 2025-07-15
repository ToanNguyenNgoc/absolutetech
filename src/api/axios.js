import { getCookie } from "@/utils/cookie";
import axios from "axios";

// export const baseURL = process.env.VUE_APP_API_URL
//   ? `${process.env.VUE_APP_API_URL}/api`
//   : '/api';

export const baseURL = "http://localhost:7891/api";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      document.cookie = "access_token=; max-age=0; path=/;";

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
