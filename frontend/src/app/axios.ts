import axios, { type InternalAxiosRequestConfig } from "axios";

const baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5106/api";

export const api = axios.create({
    baseURL,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);