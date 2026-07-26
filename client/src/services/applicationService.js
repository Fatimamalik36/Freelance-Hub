import api from "./api";

const applicationService = {
  applyToJob: (jobId, data) =>
    api.post(`/applications/${jobId}`, data).then((res) => res.data),
  getApplicationsForJob: (jobId) =>
    api.get(`/applications/job/${jobId}`).then((res) => res.data),
  getMyApplications: () =>
    api.get("/applications/my-applications").then((res) => res.data),
  updateApplicationStatus: (id, status) =>
    api.put(`/applications/${id}/status`, { status }).then((res) => res.data),
  withdrawApplication: (id) =>
    api.delete(`/applications/${id}`).then((res) => res.data),
};

export default applicationService;
