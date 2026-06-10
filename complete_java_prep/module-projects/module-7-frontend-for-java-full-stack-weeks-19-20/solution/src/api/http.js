import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
export const http = axios.create({
    baseURL,
    timeout: 10000
});
export const setAuthToken = (token) => {
    if (token) {
        http.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    else {
        delete http.defaults.headers.common.Authorization;
    }
};
