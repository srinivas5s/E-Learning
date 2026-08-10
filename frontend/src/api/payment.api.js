const paymentApi = {
    createOrder: (courseId) => api.post("/payments/create-order", { courseId }),
};