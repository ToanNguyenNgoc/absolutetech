import axiosInstance from "./axios";

export function getEntryLogs(page, limit, search) {
  return axiosInstance.get("/entry-logs", {
    params: { page, limit, search },
  });
}

export function getEntryLogsExport(search) {
  return axiosInstance.get("/entry-logs/export", {
    params: { search },
  });
}