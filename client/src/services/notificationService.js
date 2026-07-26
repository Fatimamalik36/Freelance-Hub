import api from "./api";

const notificationService = {
  getNotifications: () => api.get("/notifications").then((res) => res.data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`).then((res) => res.data),
  markAllAsRead: () => api.put("/notifications/read-all").then((res) => res.data),
  deleteNotification: (id) => api.delete(`/notifications/${id}`).then((res) => res.data),
};

export default notificationService;
