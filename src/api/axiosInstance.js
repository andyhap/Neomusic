import axios from "axios";

const API_BASE = "https://capstone-be-nine.vercel.app";

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// attach token secara otomatis
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// handle 401 global (auto logout)
axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            // arahkan ke login
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;
