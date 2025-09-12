import axiosInstance from "./axios";

export const SalaryApi = {
  getSalaryJobNumber: (params) => axiosInstance.get('/salary/job-numbers', { params }).then(res => res.data),
  getSalaryTimesheet: (params) => axiosInstance.get('/salary/timesheets', { params }).then(res => res.data),
}