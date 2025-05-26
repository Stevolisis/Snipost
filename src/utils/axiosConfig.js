import axios from "axios";

const api = axios.create({
    // baseURL:"https://snipost-api.vercel.app/api/v1",
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default api;