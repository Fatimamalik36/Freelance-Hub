import api from "./api";

const reviewService = {
  getReviewsForFreelancer: (freelancerId) =>
    api.get(`/reviews/${freelancerId}`).then((res) => res.data),
  createReview: (freelancerId, data) =>
    api.post(`/reviews/${freelancerId}`, data).then((res) => res.data),
};

export default reviewService;
