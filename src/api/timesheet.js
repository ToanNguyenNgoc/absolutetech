import axiosInstance from "./axios";

export function getTimesheets(page = 1, limit = 10, search = "") {
  return axiosInstance.get("/timesheets", {
    params: {
      page,
      limit,
      search
    },
  });
}

export function getTimesheetDetail(id) {
  return axiosInstance.get(`/timesheets/${id}`);
}