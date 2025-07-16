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

export function getOpenTimesheets(page = 1, limit = 10, search = "") {
  return axiosInstance.get("/timesheets/open", {
    params: {
      page,
      limit,
      search
    },
  });
}

export function getCloseTimesheets(page = 1, limit = 10, search = "") {
  return axiosInstance.get("/timesheets/close", {
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

export const updateTimesheet = (id, payload) => {
    return axiosInstance.put(`/timesheets/${id}`, payload);
};

export const approveTimesheet = (id) => {
    return axiosInstance.put(`/timesheets/${id}/approve`);
};

export const closeTimesheet = (id) => {
    return axiosInstance.put(`/timesheets/${id}/close`);
};