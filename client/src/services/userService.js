import api from "./api";

const userService = {
  getFreelancers: (params) =>
    api.get("/users/freelancers", { params }).then((res) => res.data),
  getUserProfile: (id) => api.get(`/users/${id}`).then((res) => res.data),
  updateProfile: (data) => api.put("/users/profile", data).then((res) => res.data),
  updateProfileImage: (formData) =>
    api
      .put("/users/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
  addPortfolio: (formData) =>
    api
      .post("/users/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
  deletePortfolio: (itemId) =>
    api.delete(`/users/portfolio/${itemId}`).then((res) => res.data),
  addExperience: (data) => api.post("/users/experience", data).then((res) => res.data),
  deleteExperience: (itemId) =>
    api.delete(`/users/experience/${itemId}`).then((res) => res.data),
  addEducation: (data) => api.post("/users/education", data).then((res) => res.data),
  deleteEducation: (itemId) =>
    api.delete(`/users/education/${itemId}`).then((res) => res.data),
  toggleSaveJob: (jobId) => api.put(`/users/save-job/${jobId}`).then((res) => res.data),
  getSavedJobs: () => api.get("/users/saved-jobs").then((res) => res.data),
  getDashboardStats: () => api.get("/users/dashboard-stats").then((res) => res.data),
};

export default userService;
