import axios from "axios";
console.log(import.meta.env.VITE_BACKED_URL)
const API = axios.create(
    {baseURL: `${import.meta.env.VITE_BACKED_URL}/api`});

export default API;
