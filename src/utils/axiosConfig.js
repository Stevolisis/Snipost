import axios from "axios";

const api = axios.create({
    baseURL:"https://snipost-api.vercel.app",
    baseURL2:"http://localhost:4000",
});

export default api;