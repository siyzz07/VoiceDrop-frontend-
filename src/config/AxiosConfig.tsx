import axios from "axios";

const API = axios.create({baseURL: "https://voicedrop-backend.onrender.com"});

export default API;
