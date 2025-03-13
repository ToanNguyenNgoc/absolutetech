export const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.VUE_APP_API_URL
    : window.location.origin;
