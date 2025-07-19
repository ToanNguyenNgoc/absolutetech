import axiosInstance from "./axios";

export const ProjectRequest = {
  get: (params) => axiosInstance.get('/project-requests', { params }).then(res => res.data),
  getDetail:(id)=> axiosInstance.get(`/project-requests/${id}`).then(res => res.data),
  getIssuesByProjectId:(id) => axiosInstance.get(`/project-requests/${id}/issues`).then(res => res.data),
}