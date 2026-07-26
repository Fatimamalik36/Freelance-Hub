import api from "./api";

const adminService = {
  getAnalytics: () => api.get("/admin/analytics").then((res) => res.data),
  getAllUsers: (params) => api.get("/admin/users", { params }).then((res) => res.data),
  toggleBlockUser: (id) =>
    api.put(`/admin/users/${id}/toggle-block`).then((res) => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((res) => res.data),
  getAllJobs: (params) => api.get("/admin/jobs", { params }).then((res) => res.data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`).then((res) => res.data),
};

export default adminService;
