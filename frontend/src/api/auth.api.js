import api from "./axios.js";

const authApi = {
    register: (data) => api.post("/register", data),
    login: (data) => api.post("/login", data),
    logout: () => api.post("/logout"),
    getMe: () => api.get("/me"),
};

export default authApi;