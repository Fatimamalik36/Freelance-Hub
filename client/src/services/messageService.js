import api from "./api";

const messageService = {
  getInbox: () => api.get("/messages").then((res) => res.data),
  getConversation: (userId) => api.get(`/messages/${userId}`).then((res) => res.data),
  sendMessage: (receiver, message) =>
    api.post("/messages", { receiver, message }).then((res) => res.data),
};

export default messageService;
