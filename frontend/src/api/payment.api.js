import api from "./axios.js";

const paymentApi = {
    createOrder: (courseId) => api.post("/payments/create-order", { courseId }),
};

export default paymentApi;