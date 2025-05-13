import axios from "axios";

const api = axios.create({
    baseURL:"https://snipost-api.vercel.app/api/v1",
    // baseURL:"http://localhost:4000/api/v1",
});

export default api;