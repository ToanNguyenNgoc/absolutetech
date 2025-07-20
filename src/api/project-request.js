import axiosInstance from "./axios";

export const ProjectRequest = {
  get: (params) => axiosInstance.get('/project-requests', { params }).then(res => res.data),
  getDetail: (id) => axiosInstance.get(`/project-requests/${id}`).then(res => res.data),
  updateDetail:(id, data) => axiosInstance.put(`/project-requests/${id}`, data).then(res => res.data),

  getIssuesByProjectId: (id) => axiosInstance.get(`/project-requests/${id}/issues`).then(res => res.data),
  createIssue: (data) => axiosInstance.post('/project-requests/issues', data).then(res => res.data),
  updateIssue: (id, data) => axiosInstance.put(`/project-requests/issues/${id}`, data).then(res => res.data),
  deleteIssue: (id) => axiosInstance.delete(`/project-requests/issues/${id}`).then(res => res.data),
}