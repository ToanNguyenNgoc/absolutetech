import axiosInstance from "./axios";

export const ReturnApi = {
  getIssueCards: (params) => axiosInstance.get('/return/issue-cards', { params }).then(res => res.data),
  postReturnIssueCards: (data) => axiosInstance.post('/return/issue-cards', data).then(res => res.data),
}