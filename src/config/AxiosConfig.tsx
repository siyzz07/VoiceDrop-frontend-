import axios from "axios";

const API = axios.create({baseURL: `${import.meta.env.VITE_BACKED_URL}`});

export default API;
