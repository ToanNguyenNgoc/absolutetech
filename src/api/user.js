import axiosInstance from "./axios";

export function getUsers(page, limit) {
  return axiosInstance.get("/users", {
    params: { page, limit },
  });
}

export function createUser(payload) {
  return axiosInstance.post("/users", payload);
}

export function updateUser(id, payload) {
  return axiosInstance.put(`/users/${id}`, payload);
}

export function deleteUser(id) {
  return axiosInstance.delete(`/users/${id}`);
}

export function importUsers(formData) {
  return axiosInstance.post("/users/import-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function exportUsers() {
  return axiosInstance.get("/users/export", {
    responseType: "blob",
  });
}