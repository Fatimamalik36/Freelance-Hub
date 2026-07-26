import api from "./api";

const jobService = {
  getJobs: (params) => api.get("/jobs", { params }).then((res) => res.data),
  getJobById: (id) => api.get(`/jobs/${id}`).then((res) => res.data),
  createJob: (data) => api.post("/jobs", data).then((res) => res.data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data).then((res) => res.data),
  deleteJob: (id) => api.delete(`/jobs/${id}`).then((res) => res.data),
  getMyJobs: () => api.get("/jobs/my-jobs").then((res) => res.data),
  hireFreelancer: (jobId, freelancerId) =>
    api.put(`/jobs/${jobId}/hire/${freelancerId}`).then((res) => res.data),
};

export default jobService;
