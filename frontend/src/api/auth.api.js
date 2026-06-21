import api from "./axios.js";

const authApi = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    logout: () => api.post("/auth/logout"),
    getMe: () => api.get("/auth/me"),
    updateMe: (data) => api.patch("/auth/update-me", data),
    changePassword: (data) => api.patch("/auth/change-password", data),
};

export default authApi;